const taskUiPropertiesView = uiResolved.bind(parent => parent ? taskUiPropertiesGetter : taskUiProperties);
const tableTaskDataPropertiesView = uiResolved.bind(parent => parent ? tableTaskDataPropertiesGetter : tableTaskDataProperties);
const jspreadsheetTaskDataPropertiesView = uiResolved.bind(parent => parent ? jspreadsheetTaskDataPropertiesGetter : jspreadsheetTaskDataProperties);
const taskDataEntityView = uiResolved.bind(parent => parent ? taskDataEntityGetter : taskDataEntity);
const header2KeyView = uiResolved.bind(parent => parent ? header2KeyGetter : header2Key);

