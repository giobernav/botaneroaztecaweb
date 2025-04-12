"use server";

export async function createUser(formData: FormData) {
  const url = "https://example.org/products.json";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ username: "example" }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);

    return { data: json };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;

    return { message };
  }
}
