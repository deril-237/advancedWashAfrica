export type Partner = {
  name: string;
  logo: string;
  link?: string;
};

function partnersLogo(name: string) {
  return `/images/partners-logo/${name}`;
}

export const Partners: Partner[] = [
  {
    name: "UNICEF",
    logo: partnersLogo("minefop.png"),
    link: "https://www.unicef.org/",
  },
  {
    name: "MINEFOP",
    logo: partnersLogo("minefop.png"),
    link: "https://www.minefop.gov.cm/",
  },
  {
    name: "RDWB",
    logo: partnersLogo("minefop.png"),
    link: "https://rdwb.org/",
  },
  {
    name: "R&D Engineering",
    logo: partnersLogo("rd-solution.png"),
  },
];
