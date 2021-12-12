export const tasks = {
  trigger: {
    label: '触发器',
    name: 'Trigger',
    description: 'Block where workflow will start executing',
    icon: 'ri-flashlight-line',
    component: 'BlockBasic',
    editComponent: 'EditTrigger',
    category: 'general',
    inputs: 0,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      type: 'manual',
      interval: 60,
      delay: 5,
      date: '',
      time: '00:00',
      url: '',
      shortcut: '',
      activeInInput: false,
      isUrlRegex: false,
    },
  },
  'new-window': {
    label: '打开浏览器',
    name: 'New window',
    description: 'Create a new window',
    icon: 'ri-window-2-line',
    component: 'BlockBasic',
    editComponent: 'EditNewWindow',
    category: 'browser',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      forceNew: false,
      browser: 1,
      browserType: 'chrome',
      executablePath: '',
      headless: false,
      useProxy: false,
      proxyUrl: '',
      proxyUserName: '',
      proxyPassword: '',
    },
  },
  'new-tab': {
    label: '新建Tab页',
    name: 'New tab',
    description: 'Create a new tab',
    icon: 'ri-global-line',
    component: 'BlockNewTab',
    editComponent: 'EditTrigger',
    category: 'browser',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      url: '',
      active: true,
    },
  },
  'take-screenshot': {
    label: '截屏',
    name: 'Take screenshot',
    description: 'Take a screenshot of current active tab',
    icon: 'ri-image-line',
    component: 'BlockBasic',
    category: 'browser',
    editComponent: 'EditTakeScreenshot',
    inputs: 1,
    outputs: 1,
    maxConnection: 1,
    allowedInputs: true,
    data: {
      fullPage: false,
      selector: '',
      saveData: false,
      fileName: '',
      ext: 'png',
      quality: 100,
      dataColumn: '',
    },
  },
  'event-click': {
    label: '点击元素',
    name: 'Click element',
    icon: 'ri-cursor-line',
    component: 'BlockBasic',
    editComponent: 'EditInteractionBase',
    category: 'browser',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      selector: '',
      markEl: false,
      multiple: false,
    },
  },
  delay: {
    label: '延迟',
    name: 'Delay',
    description: 'Add delay before executing the next block',
    icon: 'ri-timer-line',
    component: 'BlockDelay',
    editComponent: 'EditTrigger',
    category: 'general',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      time: 500,
    },
  },
  'get-text': {
    label: '获取文本',
    name: 'Get text',
    description: 'Get text from an element',
    icon: 'ri-paragraph',
    component: 'BlockBasic',
    editComponent: 'EditGetText',
    category: 'browser',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      selector: '',
      markEl: false,
      multiple: false,
      regex: '',
      regexExp: ['g'],
      dataColumn: '',
      saveData: true,
    },
  },
  'export-data': {
    label: '导出数据',
    name: 'Export data',
    icon: 'ri-download-line',
    component: 'BlockExportData',
    category: 'general',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      name: '',
      type: 'json',
    },
  },
  'element-scroll': {
    name: 'Scroll element',
    icon: 'ri-mouse-line',
    component: 'BlockBasic',
    editComponent: 'EditScrollElement',
    category: 'interaction',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      selector: 'html',
      markEl: false,
      multiple: false,
      scrollY: 0,
      scrollX: 0,
      incX: false,
      incY: false,
      smooth: false,
      scrollIntoView: false,
    },
  },
  link: {
    name: 'Link',
    description: 'Open link element',
    icon: 'ri-link',
    component: 'BlockBasic',
    editComponent: 'EditInteractionBase',
    category: 'interaction',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      selector: '',
      markEl: false,
      disableMultiple: true,
    },
  },
  'attribute-value': {
    name: 'Attribute value',
    description: 'Get attribute value of an element',
    icon: 'ri-brackets-line',
    component: 'BlockBasic',
    editComponent: 'EditAttributeValue',
    category: 'interaction',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      selector: '',
      markEl: false,
      multiple: false,
      attributeName: '',
      dataColumn: '',
      saveData: true,
    },
  },
  forms: {
    label: '表单',
    name: 'Forms',
    icon: 'ri-input-cursor-move',
    description: 'Manipulate form(input, select, checkbox, and radio) element',
    component: 'BlockBasic',
    editComponent: 'EditForms',
    category: 'browser',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      selector: '',
      markEl: false,
      multiple: false,
      selected: true,
      type: 'text-field',
      value: '',
      delay: 0,
      events: [],
    },
  },
  'repeat-task': {
    name: 'Repeat task',
    icon: 'ri-repeat-2-line',
    component: 'BlockRepeatTask',
    editComponent: 'EditTrigger',
    category: 'general',
    inputs: 1,
    outputs: 2,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      repeatFor: 1,
    },
  },
  // 'reload-page': {
  //   name: 'Reload page',
  //   icon: 'riRestartLine',
  //   component: 'BlockBasic',
  //   category: 'interaction',
  //   inputs: 1,
  //   outputs: 1,
  //   allowedInputs: true,
  //   maxConnection: 1,
  //   disableEdit: true,
  //   data: {},
  // },
  'javascript-code': {
    name: 'JavaScript code',
    description: 'Execute your custom javascript code in a webpage',
    icon: 'ri-code-s-slash-line',
    component: 'BlockBasic',
    editComponent: 'EditJavascriptCode',
    category: 'interaction',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      timeout: 10000,
      code: 'console.log("Hello world!")',
    },
  },
  'trigger-event': {
    name: 'Trigger event',
    description: 'Trigger event',
    icon: 'ri-lightbulb-flash-line',
    component: 'BlockBasic',
    editComponent: 'EditTriggerEvent',
    category: 'interaction',
    inputs: 1,
    outputs: 1,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      description: '',
      selector: '',
      markEl: false,
      multiple: false,
      eventName: '',
      eventType: '',
      eventParams: { bubbles: true, cancelable: false },
    },
  },
  conditions: {
    name: 'Conditions',
    description: 'Conditional block',
    icon: 'ri-question-mark',
    component: 'BlockConditions',
    category: 'conditions',
    inputs: 1,
    outputs: 0,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      conditions: [],
    },
  },
  'element-exists': {
    name: 'Element exists',
    description: 'Check if an element is exists',
    icon: 'ri-focus-3-line',
    component: 'BlockElementExists',
    editComponent: 'EditElementExists',
    category: 'conditions',
    inputs: 1,
    outputs: 2,
    allowedInputs: true,
    maxConnection: 1,
    data: {
      selector: '',
      tryCount: 1,
      timeout: 500,
      markEl: false,
    },
  },
}

export const categories = {
  interaction: {
    label: 'web交互',
    name: 'Web interaction',
    color: 'bg-green-200',
  },
  browser: {
    label: '浏览器组件',
    name: 'Browser',
    color: 'bg-orange-200',
  },
  general: {
    label: '通用组件',
    name: 'General',
    color: 'bg-yellow-200',
  },
  conditions: {
    label: '条件',
    name: 'Conditions',
    color: 'bg-blue-200',
  },
}

export const dataExportTypes = [
  { name: 'JSON', id: 'json' },
  { name: 'CSV', id: 'csv' },
  { name: 'Plain text', id: 'plain-text' },
]

export const eventList = [
  { id: 'click', name: 'Click', type: 'mouse-event' },
  { id: 'dblclick', name: 'Double Click', type: 'mouse-event' },
  { id: 'mouseup', name: 'Mouseup', type: 'mouse-event' },
  { id: 'mousedown', name: 'Mousedown', type: 'mouse-event' },
  { id: 'focus', name: 'Focus', type: 'focus-event' },
  { id: 'blur', name: 'Blur', type: 'focus-event' },
  { id: 'touchstart', name: 'Touch start', type: 'touch-event' },
  { id: 'touchend', name: 'Touch end', type: 'touch-event' },
  { id: 'touchmove', name: 'Touch move', type: 'touch-event' },
  { id: 'touchcancel', name: 'Touch cancel', type: 'touch-event' },
  { id: 'keydown', name: 'Keydown', type: 'keyboard-event' },
  { id: 'keyup', name: 'Keyup', type: 'keyboard-event' },
  { id: 'keypress', name: 'Keypress', type: 'keyboard-event' },
  { id: 'submit', name: 'Submit', type: 'submit-event' },
  { id: 'wheel', name: 'Wheel', type: 'wheel-event' },
]
