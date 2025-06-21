import fetch from "node-fetch";

export const verifyFacebookToken = async (token) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("Facebook token verification failed", data.error);
      return null;
    }
    return data; // Returns user details
  } catch (error) {
    console.error("Facebook token verification error", error);
    return null;
  }
};
