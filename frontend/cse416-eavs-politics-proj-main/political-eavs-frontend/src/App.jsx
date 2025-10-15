import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashPage from "./features/Splash/SplashPage.jsx";
import StatePage from "./features/State/StatePage.jsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		mode: "dark",
		primary: { main: "#1976d2" },
		background: { default: "#10131f", paper: "#171a2a" },
	},
	typography: {
		fontFamily: "sans-serif",
	},
});

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<SplashPage />} />
					<Route path="/state/:id" element={<StatePage />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}
