import { serve } from "esbuild_serve";

serve({ pages: { index: "index.tsx" }, extraLoaders: { ".glsl": "text" } });
