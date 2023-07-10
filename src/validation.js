import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import escapeString from "js-string-escape";

export function createValidator(schema) {
  const ajv = new Ajv({ allErrors: true, useDefaults: true });
  ajvFormats(ajv);

  const validator = ajv.compile(schema);

  return function validate(data) {
    const isValid = validator(data);

    if (isValid) return data;

    const { errors } = validator;

    const error = new Error(renderErrors(errors));
    error.errors = errors;

    throw error;
  };
}

function renderErrors(errors) {
  return `  - ${errors.map(renderError).join("\n  - ")}\n`;
}

function renderError(error) {
  const { instancePath, keyword, params } = error;
  let message;

  switch (keyword) {
    case "additionalProperties": {
      const { additionalProperty } = params;
      message = `should NOT have additional property '${escapeString(
        additionalProperty,
      )}'`;

      break;
    }

    default:
      message = error.message;
  }

  return `${instancePath} ${message}`;
}
