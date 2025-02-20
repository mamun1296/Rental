import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leftsidebar',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './leftsidebar.component.html',
  styleUrl: './leftsidebar.component.css'
})
export class LeftsidebarComponent {
  menuPermissions: any[] = [];
  groupedMenuPermissions: any[] = [];

  ngOnInit(): void {
    this.loadMenuPermissions();
  }

  loadMenuPermissions() {
    const storedData = localStorage.getItem('MENU_PERMISSIONS');
    if (storedData) {
      this.menuPermissions = JSON.parse(storedData);
      this.groupMenusByMainMenu();
    }
  }

  groupMenusByMainMenu() {
    // Group menus by `mainMenuId`
    this.groupedMenuPermissions = this.menuPermissions.reduce((acc, menu) => {
      const mainMenu = acc.find((x: { mainMenuId: any; }) => x.mainMenuId === menu.mainMenuId);
      if (mainMenu) {
        mainMenu.subMenus.push(menu);
      } else {
        acc.push({
          mainMenuId: menu.mainMenuId,
          mainMenuName: menu.mainMenuName,
          subMenus: [menu]
        });
      }
      return acc;
    }, []);
  }
}
