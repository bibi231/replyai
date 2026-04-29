import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navbar } from './Navbar';
export function PageWrapper({ children }) {
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-grow flex flex-col pt-6 pb-12 px-4 sm:px-6", children: _jsx("div", { className: "max-w-7xl mx-auto w-full flex-grow flex flex-col", children: children }) })] }));
}
