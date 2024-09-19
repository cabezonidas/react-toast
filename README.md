# react-toast

[![GitHub](https://img.shields.io/badge/source-GitHub-blue)](https://github.com/cabezonidas/react-toast)
[![Netlify Status](https://api.netlify.com/api/v1/badges/656c94a7-9004-4205-a150-c2c8dc85035e/deploy-status)](https://app.netlify.com/sites/headless-toaster/deploys)
[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg)](https://headless-toaster.netlify.app/)

Headless toaster for React apps

### Toasts Provider for React apps

```ts
import React from "react";
import ReactDOM from "react-dom/client";

// Include stylesheet in your application
import "@cabezonidas/react-toast/index.css";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

// Include the toast provider
root.render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);


const App = () => {
  const { toast } = useToast();
  return (
    <div className="App">
      <button
        type="button"
        onClick={() => toast('Some text')}
      >
        Toast
      </button>
    </Splitterdiv>
  )
}
```

[Open examples on CodeSandbox](https://codesandbox.io/p/sandbox/react-toast-dmdgp2)

[![CodeSandbox example](https://github.com/cabezonidas/react-toast/blob/main/assets/toasts.gif?raw=true)](https://codesandbox.io/p/sandbox/react-toast-dmdgp2)
