export async function uploadFile(
  ip: string,
  file: any
) {
  const response = await fetch(
    `http://${ip}:53319/upload`,
    {
      method: "POST",
      headers: {
        "x-file-name": file.name,
      },
      body: await fetch(file.uri).then(
        (r) => r.blob()
      ),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Error enviando archivo"
    );
  }

  return response.text();
}