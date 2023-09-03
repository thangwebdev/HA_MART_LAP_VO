const colors = [
  '#005a9f',
  '#0eca82',
  '#40128B',
  '#DF2E38',
  '#900C3F',
  '#EA1179',
  '#BA704F',
  '#F8CB2E',
];

const themes = [
//   {
//   id: 0,
//   colors: {
//     main: '#1DC071',
//     second: '#4ACD8D',
//     third: '',
//     four: '#A5E6C6',
//     fif: '#D2F2E3',
//     opacity: '#D2F2E380',
//   },
// },
  ...colors.map((color, index) => ({
    id: index,
    colors: {
      main: color,
      second: `${color}dd`,
      third: `${color}aa`,
      four: `${color}77`,
      fif: `${color}44`,
      opacity: `${color}22`,
    },
  })),
];

export default themes;
// 0123456789abcdef
