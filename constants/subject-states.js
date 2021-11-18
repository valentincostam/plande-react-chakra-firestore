const SUBJECT_STATES = Object.freeze({
  DESAPROBADA: {
    value: 'desaprobada',
    text: 'Desaprobada',
    color: { scheme: 'gray', light: 'gray.500', dark: 'gray.200' },
  },
  CURSANDO: {
    value: 'cursando',
    text: 'Cursando',
    color: { scheme: 'blue', light: 'blue.500', dark: 'blue.200' },
  },
  REGULAR: {
    value: 'regular',
    text: 'Regular',
    color: { scheme: 'yellow', light: 'yellow.500', dark: 'yellow.200' },
  },
  APROBADA: {
    value: 'aprobada',
    text: 'Aprobada',
    color: { scheme: 'green', light: 'green.500', dark: 'green.200' },
  },
});

export default SUBJECT_STATES;
