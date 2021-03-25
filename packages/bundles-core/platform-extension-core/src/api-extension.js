export const ERROR_TYPE = Object.freeze({
  INVALID_OPERATION: 'InvalidOperation',
  INVALID_INPUT: 'InvalidInput',
});

export const RESPONSE_TYPE = Object.freeze({
  UPDATE_REQUEST: 'UpdateRequest',
  FAILED_VALIDATION: 'FailedValidation',
});

/**
 * Returns an API-compliant success response
 */
export const buildSuccessResponse = (actions = []) => ({
  responseType: RESPONSE_TYPE.UPDATE_REQUEST,
  actions,
});

/**
 * Returns an API-compliant error response
 */
export const buildErrorResponse = error => ({
  responseType: RESPONSE_TYPE.FAILED_VALIDATION,
  errors: [
    {
      code: ERROR_TYPE.INVALID_OPERATION,
      message: error.message,
      extensionExtraInfo: error,
    },
  ],
});
