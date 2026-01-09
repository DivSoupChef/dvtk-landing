let activeDropdown = null;

export default function initDropdownMenu(node) {
  node.addEventListener('click', e => {
    e.stopPropagation();

    const currentButton = e.currentTarget;
    const dropdownList = currentButton.nextElementSibling.closest('.dropdown__list');

    if (!dropdownList) return;

    if (activeDropdown === dropdownList) {
      currentButton.classList.remove('_active');
      dropdownList.classList.remove('_active');
      activeDropdown = null;
      return;
    }

    if (activeDropdown) {
      const prevButton = activeDropdown.previousElementSibling?.closest('[data-module="dropdown"]');
      if (prevButton) prevButton.classList.remove('_active');
      activeDropdown.classList.remove('_active');
    }

    currentButton.classList.add('_active');
    dropdownList.classList.add('_active');
    activeDropdown = dropdownList;
  });
}

document.addEventListener('click', e => {
  const clickedElement = e.target;

  const clickedInside = clickedElement.closest('[data-module="dropdown"]') || clickedElement.closest('.dropdown__list');

  if (!clickedInside && activeDropdown) {
    const activeButton = activeDropdown.previousElementSibling?.closest('[data-module="dropdown"]');
    if (activeButton) activeButton.classList.remove('_active');
    activeDropdown.classList.remove('_active');
    activeDropdown = null;
  }
});
