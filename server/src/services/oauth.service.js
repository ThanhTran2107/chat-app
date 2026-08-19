export const getGoogleUserInfo = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(accessToken)}`,
  );

  if (!response.ok) throw new Error("Google token validation failed");

  return response.json();
};

export const getFacebookUserInfo = async (accessToken) => {
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token=${encodeURIComponent(accessToken)}`,
  );

  if (!response.ok) throw new Error("Facebook token validation failed");

  return response.json();
};
