import React from "react";
import { RegistrationProvider } from "./context/RegistrationContext.jsx";
import { RegistrationFlow } from "./features/registration/RegistrationFlow.jsx";

function App() {
  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-background text-foreground">
        <main className="py-12">
          <RegistrationFlow />
        </main>
      </div>
    </RegistrationProvider>
  );
}

export default App;
