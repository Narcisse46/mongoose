const express= require("express");
const app= express();
const port=5500;
// Middleware pour parser le JSON et les données encodées
app.use(express.json());
app.use(express.urlencoded({extended : true}));
//connecter mongoose//
const mongoose = require('mongoose');
/*(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tasktMongoose", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Base de données connectée avec succès");
  } catch (err) {
    console.error("Erreur de connexion :", err);
  }
})();*/
mongoose.connect('mongodb+srv://hounfodjisedjro:Narcisse229@cluster0.qmxc8.mongodb.net/booksDB')
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur de connexion", err));

// Définition du modèle de tâche
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

// Route pour ajouter une nouvelle tâche
app.post("/tasks", async (req, res) => {
  try {
    const { title, content } = req.body;
    const task = new Task({ title, content });
    await task.save();
    res.status(201).json({ message: "Tâche créée avec succès", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour récupérer toutes les tâches
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour modifier une tâche
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, content, completed } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.status(200).json({ message: "Tâche mise à jour avec succès", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Route pour supprimer une tâche
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lancer le serveur 
app.listen(port, () => {
    console.log(` Le Server a démarré :${port}`)
 });