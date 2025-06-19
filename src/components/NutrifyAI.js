export default function NutrifyAI({ user }) {
  return (
    <div className="container">
      <h2>Welcome, {user?.email || user?.displayName}</h2>
      <p>This is your AI-powered nutrition tracker interface!</p>
      {/* Place your previous app UI logic here */}
    </div>
  );
}