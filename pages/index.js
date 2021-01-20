import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();

  const handleChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setResponse(null);

      let formData = new FormData();
      formData.append("image", image);
      const resp = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      setLoading(false);
      setResponse(resp);
    } catch (e) {
      const resp = e.response;

      setLoading(false);
      setResponse(resp);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Image:
          <input
            type="file"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </label>
        <input
          type="submit"
          value={loading ? "Loading..." : "Submit"}
          disabled={loading}
        />
      </form>
      <br />
      {response && (
        <>
          <p>Response: </p>
          <p>
            Status: {response.status} ({response.statusText})
          </p>
          <p>{JSON.stringify(response.data)}</p>
        </>
      )}
    </>
  );
}
