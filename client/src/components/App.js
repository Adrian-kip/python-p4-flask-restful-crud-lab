import React, { useState, useEffect } from 'react';
import Plant from './Plant';
import NewPlantForm from './NewPlantForm';

function App() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch('http://localhost:5555/plants');
      if (!response.ok) throw new Error('Failed to fetch plants');
      const data = await response.json();
      setPlants(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlant = (newPlant) => {
    setPlants([...plants, newPlant]);
  };

  const handleUpdatePlant = (updatedPlant) => {
    setPlants(plants.map(plant => 
      plant.id === updatedPlant.id ? updatedPlant : plant
    ));
  };

  const handleDeletePlant = (id) => {
    setPlants(plants.filter(plant => plant.id !== id));
  };

  if (isLoading) return <div>Loading plants...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <h1>Plant Shop</h1>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <div className="plants-container">
        {plants.length > 0 ? (
          plants.map(plant => (
            <Plant
              key={plant.id}
              plant={plant}
              onUpdatePlant={handleUpdatePlant}
              onDeletePlant={handleDeletePlant}
            />
          ))
        ) : (
          <p>No plants available. Add some plants!</p>
        )}
      </div>
    </div>
  );
}

export default App;