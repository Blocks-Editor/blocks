export const USE_CASES = [];

export const FOR_LEARNING_MOTOKO = addUseCase('learning Motoko');
export const FOR_BUILDING_API = addUseCase('building an API');
export const FOR_STORING_DATA = addUseCase('storing data');
export const FOR_TRANSACTIONS = addUseCase('transaction logic');
export const FOR_REUSABLE_LOGIC = addUseCase('writing reusable logic');
export const FOR_ORGANIZATION = addUseCase('project organization');
export const FOR_ASSIGNING_ID = addUseCase('assigning unique IDs');
export const FOR_DOCUMENTATION = addUseCase('documentation');
export const FOR_CONFIGURATION = addUseCase('configuration');
export const FOR_DEBUGGING = addUseCase('debugging');
export const FOR_ERROR_HANDLING = addUseCase('error handling');
export const FOR_CUSTOM_LOGIC = addUseCase('custom logic');

function addUseCase(useCase) {
    USE_CASES.push(useCase);
    return useCase;
}