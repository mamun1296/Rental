export interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  submenus?: MenuItem[];
  expanded?: boolean;
  active: boolean;
  isVisible: boolean;
  sequence: number;
}




// export interface MenuItem {
//   title: string;
//   icon: string;
//   submenus?: MenuItem[];
//   expanded?: boolean;
//   path?: string;
//   active?: boolean;
// }

  

