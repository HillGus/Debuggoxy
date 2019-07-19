const initializeSettings = function() {

  addSettingButtonListener();
  loadSettingsIntoDOM();
};

const addSettingButtonListener = () => {

  const drawer = $('#drawer');
  const drawerOverlay = $('#drawer-overlay');
  $('#setting-btn').click(evt => {

    if (drawer.hasClass('open')) {

      drawer.removeClass('open');
      drawerOverlay.removeClass('active');
    } else {

      drawer.addClass('open');
      drawerOverlay.addClass('active');
    }
  });
};

const loadSettingsIntoDOM = () => {

  fetchSettings(settings => {

    if (settings) {

      const drawer = $('#drawer');
      settings.forEach(setting => {

        const settingTitle = $(`<div class="drawer-sub-title">${setting.label}</div>`);
        
        if (setting.fields && setting.fields.length > 0) {

          const settingMenu = $(`<ul class="drawer-menu settings-menu"></ul>`);
          setting.fields.forEach(field => {

            const inputField = $('<div class="input-field"></div>');
            const input = $('<input class="input" type="text" required>');
            const bar = $('<span class="bar"></span>');
            const label = $(`<label class="label">${field.label}</label>`);

            if (field.value)
              input.val(field.value);

            settingMenu.append($('<li></li>').append(inputField.append(input, bar, label)));
          });

          if (settingMenu.children.length > 0)
            drawer.append(settingTitle).append(settingMenu);
        }

      });
    }
  });
};

const fetchSettings = (callback: (settings: any[]) => void) => {

  const listener = message => {

    if (message && message.type === 'settings') {
      callback(message.data);
      socketService.removeMessageListener(listener);
    }
  };
  socketService.addMessageListener(listener);
  socketService.sendMessage({
    type: 'settings'
  });
}