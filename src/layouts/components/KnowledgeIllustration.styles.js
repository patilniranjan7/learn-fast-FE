import { styled } from '@mui/material/styles';

export const Illustration = styled('div')(({ theme }) => ({
  height: 307,
  width: 440,
  position: 'relative',
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    transform: 'scale(.85)',
    transformOrigin: 'left center',
  },
  [theme.breakpoints.down('md')]: { display: 'none' },
}));

export const Orbit = styled('div')(({ theme }) => ({
  position: 'absolute',
  border: `1px solid ${theme.palette.brand.orbit}`,
  width: 360,
  height: 220,
  borderRadius: '50%',
  transform: 'rotate(-25deg)',
  top: 53,
  left: 45,
  '&:nth-of-type(2)': {
    transform: 'rotate(26deg)',
    width: 320,
    left: 65,
  },
}));

export const KnowledgeCard = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 65,
  top: 65,
  width: 295,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.brand.card,
  color: theme.palette.brand.ink,
  borderRadius: theme.spacing(1.5),
  transform: 'rotate(-5deg)',
  boxShadow: `0 15px 40px ${theme.palette.brand.shadow}`,
  '& h2': {
    fontFamily: theme.typography.h2.fontFamily,
    fontWeight: 600,
    fontSize: 21,
    lineHeight: 1.4,
    letterSpacing: '-.7px',
    margin: theme.spacing(1.75, 0),
  },
}));

export const CardTop = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  fontSize: 8,
  letterSpacing: 1.3,
  fontWeight: 700,
  '& > span:last-child': { marginLeft: 'auto', letterSpacing: 2 },
}));

export const Tile = styled('span')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: 30,
  height: 30,
  backgroundColor: theme.palette.brand.tile,
  borderRadius: theme.spacing(1),
}));

export const Lines = styled('div')(({ theme }) => ({
  '& i': {
    display: 'block',
    height: 5,
    borderRadius: 8,
    backgroundColor: theme.palette.brand.line,
    marginBottom: theme.spacing(1),
    width: '95%',
  },
  '& i:nth-of-type(2)': { width: '82%' },
  '& i:nth-of-type(3)': { width: '56%' },
}));

export const CardBottom = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.brand.line}`,
  paddingTop: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: 9,
  color: theme.palette.brand.subtle,
}));

export const MiniCard = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  backgroundColor: theme.palette.brand.paper,
  color: theme.palette.brand.ink,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1.25),
  boxShadow: `0 10px 30px ${theme.palette.brand.shadow}`,
  zIndex: 2,
  '& strong': { fontSize: 11, display: 'block' },
  '& small': {
    fontSize: 9,
    color: theme.palette.brand.subtle,
    display: 'block',
    marginTop: theme.spacing(0.5),
  },
}));
