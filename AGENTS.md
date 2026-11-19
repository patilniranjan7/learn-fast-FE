# Frontend agent rules

## Scope and stack

- Apply these rules to all work in `frontned/`. Keep this existing folder name.
- Use React functional components, JavaScript, Vite, Material UI, and Emotion.
- Keep `.jsx` for JSX and `.js` for other application code. Do not migrate to TypeScript or introduce another UI/styling framework without a task requiring it.
- Read `package.json` and the affected feature before editing. Use APIs supported by the installed versions.
- These are project conventions informed by the official references below. The folder layout and 300-line limit are project decisions, not React requirements.

## File size and formatting

- **Maximum: 300 physical lines per manually authored code file**, including imports, comments, and blank lines. This applies to components, hooks, services, tests, styles, HTML, scripts, and configuration.
- Aim for 150–200 lines; extract a coherent responsibility before reaching the maximum.
- Generated files, lockfiles, dependencies, build output, and coverage are excluded. Do not label handwritten application code as generated to bypass the limit.
- Do not compress JSX, CSS, declarations, or multiple statements onto one line to evade the limit. Format JSX props and CSS declarations on separate lines when needed for readability.
- Use two-space indentation, single quotes in JavaScript, double quotes for JSX attributes, semicolons, and trailing commas in multiline objects/imports.
- Keep one primary component or responsibility per file. Small private helpers may remain when they serve only that responsibility.
- Split by meaning: form, layout, validation, request, or presentation. Avoid arbitrary `Part1`/`Part2` files.
- Run `npm run check:files` from `frontned/` before finishing code changes. This enforces size, not architecture or formatting.

## Folder structure

Use this target structure as code is created or extracted; create folders only when needed:

```text
frontned/
  AGENTS.md
  package.json
  index.html
  scripts/
    check-file-lines.mjs
  public/                      # Assets that need stable public URLs
  src/
    main.jsx                   # Mount StrictMode, AppProviders, and App
    app/
      App.jsx                  # Compose app-level UI and AppRoutes
      AppProviders.jsx         # Theme, router, and app-wide providers
    routes/
      AppRoutes.jsx            # Central route composition
      paths.js                 # Route constants and URL builders
      NotFoundPage.jsx
    layouts/
      AuthLayout.jsx           # Shared login/signup shell with Outlet
    theme/
      theme.js                 # Create and export the MUI theme
      palette.js
      typography.js
      components.js            # MUI defaultProps and styleOverrides
    features/
      auth/
        index.js               # Explicit public exports
        pages/
          LoginPage.jsx
          SignupPage.jsx
        components/
          LoginForm.jsx
          SignupForm.jsx
          PasswordField.jsx
        hooks/
          useLoginForm.js
          useSignupForm.js
        services/
          authService.js
        utils/
          authValidation.js
    shared/
      config/
        appConfig.js           # Public app constants, including companyName
      components/              # Reusable UI without feature knowledge
        BrandLogo.jsx
      hooks/                   # Hooks reusable across features
      lib/                     # Configured SDK/HTTP clients
      utils/                   # Pure, feature-independent functions
    assets/                    # Assets imported by source modules
    styles/
      global.css               # Minimal app-wide CSS only
```

- Keep tests beside their subject: `LoginForm.test.jsx`, `authValidation.test.js`.
- Keep feature-only assets and styles with that feature. A component's optional styles file is `ComponentName.styles.js` or `ComponentName.module.css`.
- Do not create parallel top-level `components/`, `hooks/`, `services/`, or catch-all `helpers/` folders; use the owning feature or `shared/`.

## Dependency boundaries

- `app/` and `routes/` compose features, layouts, theme, and shared modules.
- `layouts/` may import `shared/` and router primitives, but not feature implementation files.
- Feature pages compose feature UI and hooks. Feature hooks coordinate validation and services. Feature services use clients from `shared/lib/`.
- `shared/` must not import `features/`, `routes/`, `layouts/`, or `app/`.
- `theme/` must not depend on application UI, routing, or business logic.
- Features must not deep-import another feature's internals. Use explicit exports from its `index.js` only when that dependency is necessary and acyclic.
- Within a feature, import the concrete module rather than its own public barrel. Avoid circular imports and `export *` barrels.
- Use relative imports until an alias is configured consistently in Vite and editor/test tooling. Do not invent an unresolved `@/` alias.
- Read the company name from `shared/config/appConfig.js`; do not hardcode branding in components, page titles, or metadata. This is public configuration and must never contain secrets.

## File structure and naming

- Order files as: third-party imports, internal imports, style imports, module constants, implementation, exports.
- Use PascalCase for component files/functions and camelCase for hooks, utilities, services, variables, and handlers. Hook names start with `use`.
- Prefer named exports. Default exports are acceptable where a tool or lazy-loading convention requires them; use one consistent convention within that boundary.
- Give route pages the `Page` suffix and layouts the `Layout` suffix.
- Use descriptive props such as `onSubmit`, `isSubmitting`, and `error`. Avoid opaque booleans such as `mode2`.
- Document non-obvious component/service contracts with JSDoc, especially return values and error behavior. Comments should explain decisions rather than narrate JSX.

## UI, hooks, and business logic

- Keep render functions pure. Never mutate props/state or call network/storage APIs during rendering. Follow the Rules of Hooks and keep StrictMode enabled.
- Pages compose the screen; UI components render props and emit events. Move validation, data transformations, and provider requests out of page JSX.
- Local presentation state, such as password visibility, may stay in its component. Extract stateful workflows into purpose-specific hooks when they need isolation or reuse.
- Put synchronous business rules in pure functions that return values/errors and can run without React, the DOM, or an SDK.
- Hooks own form/request state and orchestrate services. They should return a small explicit API such as `values`, `errors`, `isSubmitting`, `handleChange`, and `handleSubmit`.
- Services own provider calls and response/error normalization. They must not render JSX, navigate, open notifications, or update component state.
- Keep state minimal; derive values rather than storing duplicate state. Lift genuinely shared state to the nearest common owner; use Context for app-wide concerns such as the authenticated session.
- Use effects for external synchronization. Handle user actions in event handlers; do not trigger submissions through effects or copy derived state through effects.
- Clean up subscriptions, listeners, and timers. Cancel or ignore obsolete requests so stale results cannot overwrite newer state.
- Never disable hook dependency rules to hide a design problem. Do not add memoization without a concrete identity/performance reason.

## Reuse without over-abstraction

- Search for an existing component, hook, service, or validator before adding one.
- Prefer MUI components directly. Create a wrapper only for a repeated behavior, domain contract, or meaningful composition; use theme defaults for appearance-only consistency.
- Keep a component feature-local until a second feature needs the same contract. Reuse inside auth does not make `PasswordField` globally shared.
- Prefer composition and `children` over many flags. Keep login and signup as separate page/form components; share password fields, layout, and validators where useful.
- Do not build a generic form engine, service factory, global store, or design system for a single use case.

## MUI theme provider and styling

- Create the theme in `src/theme/theme.js`, outside component rendering. Extract palette, typography, and component overrides as they grow.
- `src/app/AppProviders.jsx` owns the root `ThemeProvider` and `CssBaseline`. Keep one default theme provider; add scoped nested themes only for a real product requirement.
- Root composition is `StrictMode -> AppProviders -> App -> AppRoutes`. Providers must wrap all their consumers; include the single router provider in `AppProviders` when routing is installed.
- Use semantic palette tokens, typography variants, theme spacing, shape, and breakpoints. Define new brand colors centrally; avoid repeating hex values and arbitrary spacing throughout components.
- Use theme `components.*.defaultProps` and `styleOverrides` for app-wide MUI defaults. Use `sx` for small local styles and `styled()` or a colocated styles module for larger reusable styles.
- Prefer responsive `sx` values, such as `sx={{ px: { xs: 2, md: 4 } }}`, over duplicated viewport logic in JavaScript.
- Keep global CSS limited to document defaults and truly global assets. Isolate illustration/animation styles in a component or CSS module.
- Do not override generated Emotion class names, style every `input`/`button` globally, duplicate `CssBaseline` resets, or use `!important` to fight MUI.
- Keep font stacks and typography in the theme. Preserve keyboard focus, error states, and readable contrast in all overrides.

## Routing

- Use the installed `react-router` package for application navigation, using APIs supported by its installed version. `AppProviders` owns `BrowserRouter`; `AppRoutes` owns route composition.
- `src/routes/AppRoutes.jsx` is the route source of truth; `paths.js` owns shared paths and parameter builders. Keep feature logic out of these files.
- Define `/login` and `/signup` as distinct routes under `AuthLayout`, which renders an `Outlet`. Redirect `/` deliberately and include a `*` not-found route.
- Use one router provider. Prefer `BrowserRouter`; production hosting must rewrite application routes to `index.html` so refreshes and direct links work. Use HashRouter only for a deployment constraint.
- Use router `Link`/`NavLink` for internal navigation and `useNavigate` for navigation after actions. Compose MUI Link/Button with the router link. Use anchors for external URLs.
- Do not parse `window.location`, subscribe to `hashchange`, or duplicate router state with a page boolean.
- Preserve a deliberate transition from existing `#login`/`#signup` links when replacing them; avoid leaving links that silently stop working.
- Put route guards in their owning feature and compose them in route configuration. Handle session loading before redirecting. A client guard is UX; backend permissions remain mandatory.
- Do not add lazy loading to every tiny module. Split substantial route bundles when useful and provide loading/error UI.

## Forms, requests, and accessibility

- Associate labels with inputs; use correct input types, names, autocomplete values, and required indicators. Keep passwords out of URLs, logs, analytics, and persistent form drafts.
- Keep validation rules in feature utilities. Connect errors to MUI `error`/`helperText`; make validation messages understandable and accessible.
- Use semantic form submission and explicit button types. Prevent duplicate requests, show pending state, and preserve useful input after a failure.
- Handle success, failure, loading, and empty states explicitly. Missing provider configuration must not produce a fake successful login/signup.
- Keep credentials and authorization on the appropriate server/provider boundary. Vite client environment variables are public; never put service-role keys or other server secrets in them.
- Use semantic headings/landmarks, accessible icon-button names, keyboard navigation, visible focus, and meaningful image alternatives.
- Preserve focus sensibly on route changes and form errors. Check both a narrow mobile viewport and a desktop viewport for visual/layout changes.

## Verification and completion

- For code changes, run `npm run check:files` and `npm run build` from `frontned/`.
- Run lint/format/tests when configured; do not claim they ran if the scripts do not exist. When adding ESLint, enable React Hooks rules and `max-lines` with `max: 300`, `skipBlankLines: false`, `skipComments: false`.
- For meaningful behavior changes, test observable outcomes: login/signup navigation, invalid input, mismatched passwords, request failures, and pending submission as relevant. Avoid tests that only mirror markup or trivial implementation.
- Keep reusable business logic testable independently of rendering. Mock service boundaries in UI tests, not React internals.
- Before completion, check ownership/import boundaries, file sizes, theme consistency, accessible states, and the absence of obsolete code.
- Report what changed and what was verified. Identify remaining migration work accurately; do not imply that writing these rules already restructured the app.

## Current implementation baseline

- App providers, MUI theme, routes, auth pages/forms/hooks/validation, and layout illustrations are separated into the boundaries above.
- `/login` and `/signup` are clean URL routes. `LegacyAuthRedirect` only translates old auth fragments using router location state; do not introduce new hash-based navigation.
- Vitest and Testing Library cover route/form behavior. Prettier enforces formatting with `npm run format:check`; `npm run format` applies it.
- Authentication is still a placeholder. Redux Toolkit is installed; no store is needed for route state or local form fields.

## Official references

- React component/state design: [Thinking in React](https://react.dev/learn/thinking-in-react).
- React purity and hook rules: [Rules of React](https://react.dev/reference/rules).
- Stateful logic reuse: [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).
- Effects and derived state: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
- MUI provider and tokens: [Theming](https://mui.com/material-ui/customization/theming/).
- MUI styling choices: [How to customize](https://mui.com/material-ui/customization/how-to-customize/).
- Route/layout composition: [React Router routing](https://reactrouter.com/start/declarative/routing).
- Future lint enforcement: [ESLint max-lines](https://eslint.org/docs/latest/rules/max-lines).
