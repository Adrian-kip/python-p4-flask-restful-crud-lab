import { useState } from "react";

function NewPlantForm({ onAddPlant }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (!formData.name || !formData.image || !formData.price) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    fetch("/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to add plant");
        return r.json();
      })
      .then((newPlant) => {
        onAddPlant(newPlant);
        setFormData({ name: "", image: "", price: "" });
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="new-plant-form">
      <h2>New Plant</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Plant name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          step="0.01"
          min="0"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Plant"}
        </button>
      </form>
    </div>
  );
}

export default NewPlantForm;