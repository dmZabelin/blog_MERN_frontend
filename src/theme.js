import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	shadows: 'none',
	palette: {
		primary: {
			main: '#4361ee'
		}
	},
	typography: {
		button: {
			fontWeight: 500,
			fontSize: 12,
			letterSpacing: '0.05em'
		}
	}
});
