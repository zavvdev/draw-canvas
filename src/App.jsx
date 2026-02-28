import { ColorSelect } from "./components/atoms/color-select/color-select.atom.jsx";
import { ContextDropdown } from "./components/atoms/context-dropdown/context-dropdown.atom.jsx";
import { MenuButton } from "./components/atoms/menu-button/menu-button.atom.jsx";
import "./index.css";

/**
 * @todo
 * - [x] Review utilities
 * - [x] Review atoms
 * - [ ] Review molecules
 * - [ ] Review organisms
 */

export var App = () => {
  return (
    <div>
      <ColorSelect />
      <ContextDropdown opener={<button>Context Dropdown</button>}>
        Menu
      </ContextDropdown>
      <MenuButton>
        Menu Button
      </MenuButton>
    </div>
  );
};
