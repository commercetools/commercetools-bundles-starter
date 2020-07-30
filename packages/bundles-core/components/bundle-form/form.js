import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import kebabCase from 'lodash/kebabCase';
import mapValues from 'lodash/mapValues';
import {
  Card,
  CollapsiblePanel,
  Constraints,
  LocalizedTextField,
  LocalizedTextInput,
  PrimaryButton,
  Spacings,
  Text,
  TextField,
} from '@commercetools-frontend/ui-kit';
import messages from './messages';
import styles from './form.mod.css';

const Form = ({
  dataLocale,
  initialValidation,
  fields,
  component,
  values,
  errors,
  touched,
  dirty,
  isValid,
  isSubmitting,
  handleBlur,
  handleChange,
  handleSubmit,
  setFieldValue,
}) => {
  const intl = useIntl();

  useEffect(() => {
    if (
      !initialValidation.slugDefined &&
      !LocalizedTextInput.isTouched(touched.slug)
    ) {
      const slug = mapValues(values.name, (value) =>
        kebabCase(value).toLowerCase()
      );
      setFieldValue('slug', slug);
    }
  }, [values.name]);

  return (
    <Spacings.Stack scale="s">
      <CollapsiblePanel
        header={
          <Text.Subheadline
            as="h4"
            intlMessage={messages.generalInformationTitle}
            isBold={true}
          />
        }
        className={styles.panel}
      >
        <Constraints.Horizontal constraint="l">
          <Card type="flat" className={styles['field-card']}>
            <LocalizedTextField
              name="name"
              value={values.name}
              title={<FormattedMessage {...messages.bundleNameTitle} />}
              selectedLanguage={dataLocale}
              isRequired={true}
              errors={errors.name}
              touched={LocalizedTextInput.isTouched(touched.name)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
          <Card type="flat" className={styles['field-card']}>
            <LocalizedTextField
              name="description"
              value={values.description}
              title={<FormattedMessage {...messages.bundleDescriptionTitle} />}
              selectedLanguage={dataLocale}
              touched={LocalizedTextInput.isTouched(touched.description)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
          <Card type="flat" className={styles['field-card']}>
            <TextField
              name="key"
              value={values.key}
              title={<FormattedMessage {...messages.bundleKeyTitle} />}
              hint={<FormattedMessage {...messages.bundleKeyDescription} />}
              touched={touched.key}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
          <Card type="flat" className={styles['field-card']}>
            <TextField
              name="sku"
              value={values.sku}
              title={<FormattedMessage {...messages.bundleSkuTitle} />}
              touched={touched.sku}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
        </Constraints.Horizontal>
      </CollapsiblePanel>
      <CollapsiblePanel
        header={
          <Text.Subheadline
            as="h4"
            intlMessage={messages.bundleInformationTitle}
            isBold={true}
          />
        }
        className={styles.panel}
      >
        <Constraints.Horizontal constraint="l">
          {fields &&
            fields.map((field) => (
              <Card
                key={field.props.name}
                type="flat"
                className={styles['field-card']}
              >
                {field}
              </Card>
            ))}
          {component && (
            <Card type="flat" className={styles['field-card']}>
              <FieldArray
                name={component.name}
                render={({ push, remove }) => component.field(push, remove)}
              />
            </Card>
          )}
        </Constraints.Horizontal>
      </CollapsiblePanel>
      <CollapsiblePanel
        header={
          <Text.Subheadline
            as="h4"
            intlMessage={messages.externalSearchTitle}
            isBold={true}
          />
        }
        className={styles.panel}
      >
        <Constraints.Horizontal constraint="l">
          <Card type="flat" className={styles['field-card']}>
            <LocalizedTextField
              name="slug"
              value={values.slug}
              title={<FormattedMessage {...messages.bundleSlugTitle} />}
              hint={<FormattedMessage {...messages.bundleSlugDescription} />}
              selectedLanguage={dataLocale}
              isRequired={true}
              errors={errors.slug}
              touched={LocalizedTextInput.isTouched(touched.slug)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
        </Constraints.Horizontal>
      </CollapsiblePanel>
      <Constraints.Horizontal constraint="scale">
        <PrimaryButton
          label={intl.formatMessage(messages.submitButton)}
          isDisabled={!dirty || !isValid || isSubmitting}
          onClick={handleSubmit}
        />
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};
Form.displayName = 'Form';
Form.propTypes = {
  dataLocale: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.node),
  component: PropTypes.shape({
    name: PropTypes.string,
    field: PropTypes.func,
  }),
  initialValidation: PropTypes.shape({
    slugDefined: PropTypes.bool,
  }).isRequired,
  values: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    description: PropTypes.objectOf(PropTypes.string),
    key: PropTypes.string.isRequired,
    sku: PropTypes.string,
    slug: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.shape({
      missing: PropTypes.bool,
    }),
    slug: PropTypes.shape({
      missing: PropTypes.bool,
    }),
  }).isRequired,
  touched: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.bool),
    description: PropTypes.objectOf(PropTypes.bool),
    key: PropTypes.bool,
    sku: PropTypes.bool,
    slug: PropTypes.objectOf(PropTypes.bool),
  }),
  dirty: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default Form;
