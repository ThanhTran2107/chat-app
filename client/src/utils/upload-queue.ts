export type UploadJob<T> = {
  key: string;
  run: () => Promise<T | undefined>;
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
  onRetry?: (attempt: number, error: unknown) => void;
  onStart?: () => void;
};

const DEFAULT_MAX_CONCURRENT = 2;
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY = 500;

export const createUploadQueue = <T>(options?: {
  maxConcurrent?: number;
  maxAttempts?: number;
  baseDelay?: number;
}) => {
  const maxConcurrent = options?.maxConcurrent ?? DEFAULT_MAX_CONCURRENT;
  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const baseDelay = options?.baseDelay ?? DEFAULT_BASE_DELAY;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getBackoffDelay = (attempt: number) => {
    const exponential = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 200;

    return exponential + jitter;
  };

  const isRetryableError = (error: unknown) => {
    if (!error) return false;

    if (typeof error === 'object' && error !== null) {
      const status = (error as { response?: { status?: number } }).response?.status;
      const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code;

      if (code === 'MAX_ATTACHMENTS_PER_SEND_EXCEEDED') return false;

      if (typeof status === 'number') {
        if (status === 408 || status === 429 || status >= 500) return true;
        if (status === 400 || status === 403 || status === 404) return false;
      }
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('network') || message.includes('timeout') || message.includes('econnreset')) return true;
    }

    return false;
  };

  const processJob = async (job: UploadJob<T>): Promise<T | undefined> => {
    job.onStart?.();

    let attempt = 0;
    let lastError: unknown = null;

    while (attempt < maxAttempts) {
      attempt += 1;

      try {
        const result = await job.run();

        if (result !== undefined) job.onSuccess?.(result);

        return result;
      } catch (error) {
        lastError = error;

        if (attempt < maxAttempts && isRetryableError(error)) {
          job.onRetry?.(attempt, error);

          await sleep(getBackoffDelay(attempt));

          continue;
        }

        break;
      }
    }

    job.onError?.(lastError);

    return undefined;
  };

  const drain = async (jobs: UploadJob<T>[]) => {
    const results = new Map<string, T | undefined>();
    let nextIndex = 0;
    let activeCount = 0;
    let resolved = false;

    const checkDone = () => {
      if (nextIndex === jobs.length && activeCount === 0) resolved = true;
    };

    const runNext = async () => {
      while (nextIndex < jobs.length && activeCount < maxConcurrent) {
        const job = jobs[nextIndex];
        nextIndex += 1;
        activeCount += 1;

        Promise.resolve()
          .then(() => processJob(job))
          .then(result => results.set(job.key, result))
          .catch(() => {
            // processJob handles errors via onError
          })
          .finally(() => {
            activeCount -= 1;
            runNext();
            checkDone();
          });
      }
    };

    await runNext();

    if (!resolved) {
      await new Promise<void>(resolve => {
        const check = () => {
          if (resolved) return resolve();
          setTimeout(check, 50);
        };

        check();
      });
    }

    return { results, errors: new Map<string, unknown>() };
  };

  return {
    drain,
    processJob,
  };
};
