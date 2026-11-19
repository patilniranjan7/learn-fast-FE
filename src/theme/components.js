export const components = {
  MuiTextField: {
    defaultProps: { fullWidth: true, size: 'small' },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
  },
  MuiLink: {
    defaultProps: { underline: 'hover' },
  },
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      ':focus-visible': {
        outline: `3px solid ${theme.palette.brand.highlight}`,
        outlineOffset: 4,
      },
    }),
  },
};
