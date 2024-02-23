import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { cloneDeep, defaultsDeep, set } from 'lodash';
import { Formik } from 'formik';
import { mockMutation, setMutation, getQuery, setQuery } from '@apollo/client';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { PriceFilters } from '@commercetools-us-ps/bundles-core/components';
import { localize } from '@commercetools-us-ps/bundles-core/components/util';
import { useEffectMock } from '@commercetools-us-ps/bundles-core/components/test-util';
import { generateCategoryAttributes, generateProduct } from '../../test-util';
import { transformResults } from '../bundle-details/dynamic-bundle-details';
import { getCategoryAttributes } from './category-product-field';
import BundlePreview, { getCartSelections, PROJECTION } from './bundle-preview';
import messages from './messages';
import { omitDeep } from '../../util';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()],
  currencies: [faker.finance.currencyCode(), faker.finance.currencyCode()],
};
const dataLocale = project.languages[0];
const mocks = {
  refetch: jest.fn(),
};

const product = generateProduct(project.languages);
const { staged, current } = product.masterData;
const bundle = {
  ...transformResults(current),
  staged: transformResults(staged),
  current: transformResults(current),
};

const dynamicPrice = {
  price: null,
  dynamicPrice: true,
};

const staticPrice = { dynamicPrice: false };

const dynamicPriceBundle = defaultsDeep(
  { ...dynamicPrice },
  { staged: { ...dynamicPrice } },
  { current: { ...dynamicPrice } },
  bundle
);
const staticPriceBundle = defaultsDeep(
  { ...staticPrice },
  { staged: { ...staticPrice } },
  { current: { ...staticPrice } },
  bundle
);
const priceFilters = {
  currency: project.currencies[0],
  country: null,
  channel: null,
  customerGroup: null,
  date: null,
};
const mockRef = {
  current: {
    scrollIntoView: jest.fn(),
  },
};

const bundleName = '[data-testid="bundle-name"]';
const bundleDescription = '[data-testid="bundle-description"]';
const mainImage = '[data-testid="main-image"]';
const basePriceLabel = "[data-testid='base-price-label']";
const basePriceValue = "[data-testid='base-price-value']";
const additionalPriceLabel = "[data-testid='additional-price-label']";
const additionalPriceValue = "[data-testid='additional-price-value']";
const totalPriceLabel = "[data-testid='total-price-label']";
const totalPriceValue = "[data-testid='total-price-value']";

const loadBundlePreview = (mockBundle = bundle) =>
  shallow(<BundlePreview bundle={mockBundle} {...mocks} />);

describe('bundle preview', () => {
  beforeAll(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));

    jest.spyOn(React, 'useEffect').mockImplementation(useEffectMock);
  });

  beforeEach(() => {
    setQuery({ loading: true });
  });

  it('should display localized bundle name', () => {
    const wrapper = loadBundlePreview();
    const name = wrapper.find(bundleName);
    expect(name.html()).toContain(
      localize({
        obj: bundle,
        key: 'name',
        language: dataLocale,
        fallback: project.languages,
      })
    );
  });

  it('when description provided, should display localized bundle description', () => {
    const wrapper = loadBundlePreview();
    const description = wrapper.find(bundleDescription);
    expect(description.html()).toContain(
      localize({
        obj: bundle,
        key: 'description',
        language: dataLocale,
        fallback: project.languages,
      })
    );
  });

  it('when description not provided, should display no description message', () => {
    const mockBundle = cloneDeep(bundle);
    set(mockBundle, 'staged.description', null);
    set(mockBundle, 'current.description', null);
    const wrapper = loadBundlePreview(mockBundle);
    expect(
      wrapper.find('[data-testid="no-description-message"]').exists()
    ).toEqual(true);
  });

  describe('when projection selection changed', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = loadBundlePreview();
      wrapper
        .find('[data-testid="projection-select"]')
        .props()
        .onChange({ target: { value: PROJECTION.STAGED } });
    });

    it('should display projection localized bundle name', () => {
      const name = wrapper.find(bundleName);
      expect(name.html()).toContain(
        localize({
          obj: bundle.staged,
          key: 'name',
          language: dataLocale,
          fallback: project.languages,
        })
      );
    });

    it('should display projection localized bundle description', () => {
      const name = wrapper.find(bundleDescription);
      expect(name.html()).toContain(
        localize({
          obj: bundle.staged,
          key: 'description',
          language: dataLocale,
          fallback: project.languages,
        })
      );
    });
  });

  describe('when bundle has images', () => {
    const generateImage = () => ({
      url: faker.image.imageUrl(640, 480, faker.random.word()),
    });

    it('should display the first image as the main image', () => {
      const { images } = bundle.current;
      const wrapper = loadBundlePreview();
      expect(wrapper.find(mainImage).prop('src')).toEqual(images[0].url);
    });

    describe('when bundle has more than one image', () => {
      const length = faker.datatype.number({ min: 2, max: 10 });
      const images = Array.from({ length }).map(generateImage);
      const [, ...side] = images;
      const mockBundle = cloneDeep(bundle);
      set(mockBundle, 'staged.images', images);
      set(mockBundle, 'current.images', images);
      const sideImage = '[data-testid="side-image"]';
      let wrapper;

      beforeEach(() => {
        wrapper = loadBundlePreview(mockBundle);
      });

      it('should display remaining images as side images', () => {
        expect(wrapper.find(sideImage).length).toEqual(length - 1);
      });

      describe('when side image selected', () => {
        beforeEach(() => {
          wrapper.find(sideImage).first().simulate('click');
          wrapper.update();
        });

        it('should set selected image as main image', () => {
          expect(wrapper.find(mainImage).prop('src')).toEqual(side[0].url);
        });
      });
    });

    it('when bundle has only one image, should not display side image container', () => {
      const images = [generateImage()];
      const mockBundle = cloneDeep(bundle);
      set(mockBundle, 'staged.images', images);
      set(mockBundle, 'current.images', images);

      const wrapper = loadBundlePreview(mockBundle);
      expect(
        wrapper.find('[data-testid="side-images-container"]').exists()
      ).toEqual(false);
    });
  });

  it('when bundle has no images, should display no image placeholder', () => {
    const mockBundle = cloneDeep(bundle);
    set(mockBundle, 'staged.images', []);
    set(mockBundle, 'current.images', []);
    const wrapper = loadBundlePreview(mockBundle);
    expect(
      wrapper.find('[data-testid="no-image-placeholder"]').exists()
    ).toEqual(true);
  });

  describe('price filters', () => {
    it('when currency filter changed, should refetch bundle information with price scoped to currency', () => {
      const wrapper = loadBundlePreview();
      const currency = 'EUR';
      wrapper.find(PriceFilters).props().setCurrency(currency);
      expect(mocks.refetch).toHaveBeenCalledWith({
        ...priceFilters,
        currency,
      });
    });

    it('when country filter changed, should refetch bundle information with price scoped to country', () => {
      const wrapper = loadBundlePreview();
      const country = faker.address.country();
      wrapper.find(PriceFilters).props().setCountry(country);
      expect(mocks.refetch).toHaveBeenCalledWith({
        ...priceFilters,
        country,
      });
    });

    it('when channel filter changed, should refetch bundle information with price scoped to channel', () => {
      const wrapper = loadBundlePreview();
      const id = faker.datatype.uuid();
      const channel = JSON.stringify({ id });
      wrapper.find(PriceFilters).props().setChannel(channel);
      expect(mocks.refetch).toHaveBeenCalledWith({
        ...priceFilters,
        channel: id,
      });
    });

    it('when customer group filter changed, should refetch bundle information with price scoped to customer group', () => {
      const wrapper = loadBundlePreview();
      const id = faker.datatype.uuid();
      const customerGroup = JSON.stringify({ id });
      wrapper.find(PriceFilters).props().setCustomerGroup(customerGroup);
      expect(mocks.refetch).toHaveBeenCalledWith({
        ...priceFilters,
        customerGroup: id,
      });
    });

    it('when date filter changed, should refetch bundle information with price scoped to date', () => {
      const wrapper = loadBundlePreview();
      const date = faker.date.recent(10).toISOString();
      wrapper.find(PriceFilters).props().setDate(date);
      expect(mocks.refetch).toHaveBeenCalledWith({
        ...priceFilters,
        date,
      });
    });
  });

  describe('price range', () => {
    const min = faker.datatype.number({ min: 1000, max: 2000 });
    const max = faker.datatype.number({ min: 2000, max: 4000 });
    const data = {
      products: {
        facets: {
          'variants.scopedPrice.currentValue.centAmount': {
            ranges: [
              {
                min,
                max,
              },
            ],
          },
        },
      },
    };

    const priceRangeMin = '[data-testid="price-range-min"]';
    const priceRangeMax = '[data-testid="price-range-max"]';

    beforeEach(() => {
      setQuery({ data });
    });

    it('when bundle is statically priced, should not retrieve price range for each bundle category', () => {
      const query = getQuery();
      loadBundlePreview(staticPriceBundle);
      expect(query.refetch).not.toHaveBeenCalled();
    });

    it('when bundle is dynamically priced, should retrieve price range for each bundle category', () => {
      const query = getQuery();
      loadBundlePreview(dynamicPriceBundle);
      expect(query.refetch).toHaveBeenCalledTimes(
        dynamicPriceBundle.current.categories.length
      );
    });

    describe('when dynamically priced bundle has categories with min and max quantity', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadBundlePreview(dynamicPriceBundle);
      });

      it.skip('should display summed minimum price', () => {
        const totalMin = dynamicPriceBundle.current.categories.reduce(
          (result, category) => {
            const { minQuantity } = getCategoryAttributes(category);
            return result + minQuantity * min;
          },
          0
        );
        expect(wrapper.find(priceRangeMin).exists()).toEqual(true);
        expect(wrapper.find(priceRangeMin).prop('value')).toEqual(
          totalMin / 100
        );
      });

      it('should display summed maximum price', () => {
        const totalMax = dynamicPriceBundle.current.categories.reduce(
          (result, category) => {
            const { maxQuantity } = getCategoryAttributes(category);
            return result + maxQuantity * max;
          },
          0
        );
        expect(wrapper.find(priceRangeMax).prop('value')).toEqual(
          totalMax / 100
        );
      });
    });

    describe('when dynamically priced bundle has categories with only min quantities', () => {
      const categories = Array.from({ length: 2 }).map(() =>
        generateCategoryAttributes(
          faker.datatype.boolean(),
          faker.datatype.number({ min: 1, max: 10 }),
          0
        )
      );
      const mockBundle = cloneDeep(dynamicPriceBundle);
      set(mockBundle, 'staged.categories', categories);
      set(mockBundle, 'current.categories', categories);
      let wrapper;

      beforeEach(() => {
        wrapper = loadBundlePreview(mockBundle);
      });

      it('should display summed minimum price', () => {
        const totalMin = mockBundle.current.categories.reduce(
          (result, category) => {
            const { minQuantity } = getCategoryAttributes(category);
            return result + minQuantity * min;
          },
          0
        );
        expect(wrapper.find(priceRangeMin).prop('value')).toEqual(
          totalMin / 100
        );
      });

      it('should not display summed maximum price', () => {
        expect(wrapper.find(priceRangeMax).exists()).toEqual(false);
      });
    });

    describe('when dynamically priced bundle has categories with only max quantities', () => {
      const categories = Array.from({ length: 2 }).map(() =>
        generateCategoryAttributes(
          faker.datatype.boolean(),
          0,
          faker.datatype.number({ min: 1, max: 10 })
        )
      );
      const mockBundle = cloneDeep(dynamicPriceBundle);
      set(mockBundle, 'staged.categories', categories);
      set(mockBundle, 'current.categories', categories);
      let wrapper;

      beforeEach(() => {
        wrapper = loadBundlePreview(mockBundle);
      });

      it('should not display summed minimum price', () => {
        expect(wrapper.find(priceRangeMin).exists()).toEqual(false);
      });

      it('should display summed maximum price', () => {
        const totalMax = mockBundle.current.categories.reduce(
          (result, category) => {
            const { maxQuantity } = getCategoryAttributes(category);
            return result + maxQuantity * max;
          },
          0
        );
        expect(wrapper.find(priceRangeMax).prop('value')).toEqual(
          totalMax / 100
        );
      });
    });

    describe('when dynamically priced bundle has categories with no min or max quantities', () => {
      const categories = Array.from({ length: 2 }).map(() =>
        generateCategoryAttributes(faker.datatype.boolean(), 0, 0)
      );
      const mockBundle = cloneDeep(dynamicPriceBundle);
      set(mockBundle, 'staged.categories', categories);
      set(mockBundle, 'current.categories', categories);
      let wrapper;

      beforeEach(() => {
        wrapper = loadBundlePreview(mockBundle);
      });

      it('should not display summed minimum price', () => {
        expect(wrapper.find(priceRangeMin).exists()).toEqual(false);
      });

      it('should not display summed maximum price', () => {
        expect(wrapper.find(priceRangeMax).exists()).toEqual(false);
      });
    });
  });

  describe('when statically priced bundle has price with no additional charges', () => {
    let formik;

    beforeEach(() => {
      const wrapper = loadBundlePreview(staticPriceBundle);
      formik = wrapper.find(Formik).shallow();
    });

    it('should display base price label as total price', () => {
      expect(formik.find(basePriceLabel).prop('intlMessage')).toEqual(
        messages.totalPrice
      );
    });

    it('should display total price label as bold', () => {
      expect(formik.find(basePriceLabel).prop('isBold')).toEqual(true);
    });

    it('should display total price value as bundle price', () => {
      expect(formik.find(basePriceValue).prop('value')).toEqual(
        bundle.price.value.centAmount / 100
      );
    });

    it('should not display additional charges', () => {
      expect(formik.find(additionalPriceLabel).exists()).toEqual(false);
    });
  });

  describe('when statically priced bundle has price with additional charges', () => {
    const category = 'category0';
    const bundlePrice = bundle.price.value.centAmount;
    const additionalCharge = 50000;
    let wrapper;

    beforeEach(async () => {
      wrapper = loadBundlePreview(staticPriceBundle);
      const formik = wrapper.find(Formik).shallow();
      formik
        .find(`[name='${category}']`)
        .props()
        .onChange({
          target: {
            name: `${category}.price`,
            value: { centAmount: additionalCharge, currency: 'USD' },
          },
        });
    });

    it('should display base price label', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(basePriceLabel).prop('intlMessage')).toEqual(
        messages.basePrice
      );
    });

    it('should display base price value as bundle price', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(basePriceValue).prop('value')).toEqual(
        bundlePrice / 100
      );
    });

    it('should display additional charges value', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(additionalPriceValue).prop('value')).toEqual(
        additionalCharge / 100
      );
    });

    it('should display total price value as bundle price plus additional charges', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(totalPriceValue).prop('value')).toEqual(
        (bundlePrice + additionalCharge) / 100
      );
    });
  });

  describe('when statically priced bundle has no price with additional charges', () => {
    const price = null;
    const mockBundle = cloneDeep(staticPriceBundle);
    set(mockBundle, 'staged.price', price);
    set(mockBundle, 'current.price', price);
    const category = 'category0';
    const additionalCharge = 50000;
    let wrapper;

    beforeEach(() => {
      wrapper = loadBundlePreview(mockBundle);
      const formik = wrapper.find(Formik).shallow();
      formik
        .find(`[name='${category}']`)
        .props()
        .onChange({
          target: {
            name: `${category}.price`,
            value: { centAmount: additionalCharge, currency: 'USD' },
          },
        });
    });

    it('should display base price value as fallback value', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(
        formik.find("[data-testid='base-price-value-container']").html()
      ).toContain(NO_VALUE_FALLBACK);
    });

    it('should display total price value as additional charges', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(totalPriceValue).prop('value')).toEqual(
        additionalCharge / 100
      );
    });
  });

  describe('when dynamically priced bundle has no line item prices', () => {
    let formik;

    beforeEach(() => {
      const wrapper = loadBundlePreview(dynamicPriceBundle);
      formik = wrapper.find(Formik).shallow();
    });

    it('should display base price label as total price', () => {
      expect(formik.find(basePriceLabel).prop('intlMessage')).toEqual(
        messages.totalPrice
      );
    });

    it('should display base price value as fallback value', () => {
      expect(
        formik.find("[data-testid='base-price-value-container']").html()
      ).toContain(NO_VALUE_FALLBACK);
    });

    it('should not display additional price label', () => {
      expect(formik.find(additionalPriceLabel).exists()).toEqual(false);
    });

    it('should not display total price label', () => {
      expect(formik.find(totalPriceLabel).exists()).toEqual(false);
    });
  });

  describe('when dynamically priced bundle has line item prices', () => {
    const category = 'category0';
    const lineItemPrice = 50000;
    let wrapper;

    beforeEach(() => {
      wrapper = loadBundlePreview(dynamicPriceBundle);
      const formik = wrapper.find(Formik).shallow();
      formik
        .find(`[name='${category}']`)
        .props()
        .onChange({
          target: {
            name: `${category}.price`,
            value: { centAmount: lineItemPrice, currency: 'USD' },
          },
        });
    });

    it('should not display base price label', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(basePriceLabel).exists()).toEqual(false);
    });

    it('should not display additional price label', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(additionalPriceLabel).exists()).toEqual(false);
    });

    it('should display total price label', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(totalPriceLabel).exists()).toEqual(true);
    });

    it('should display total price value as additional charges', () => {
      const formik = wrapper.find(Formik).shallow();
      expect(formik.find(totalPriceValue).prop('value')).toEqual(
        lineItemPrice / 100
      );
    });
  });

  describe('add to cart', () => {
    const formValues = Array.from({ length: 2 }).reduce(
      (form, value, index) => ({
        ...form,
        [`category${index}`]: {
          quantity: faker.datatype.number({ min: 1, max: 5 }),
          product: {
            value: JSON.stringify({
              productId: faker.datatype.uuid(),
              id: faker.datatype.number({ min: 1, max: 5 }),
            }),
          },
        },
      }),
      {}
    );
    const selections = getCartSelections(formValues);

    const getCartDraft = (lineItems = []) => ({
      currency: project.currencies[0],
      lineItems: [
        {
          productId: bundle.id,
          quantity: 1,
        },
        ...lineItems,
      ],
    });

    beforeAll(() => {
      jest.spyOn(React, 'useRef').mockImplementation(() => mockRef);
    });

    it('should create cart from bundle with selected products as line items', () => {
      setMutation({ loading: true });
      const wrapper = loadBundlePreview();
      wrapper.find(Formik).props().onSubmit(formValues);
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          cartDraft: getCartDraft(selections),
        },
      });
    });

    it('when no products selected, should not include additional line items in cart', () => {
      setMutation({ loading: true });
      const wrapper = loadBundlePreview();
      wrapper
        .find(Formik)
        .props()
        .onSubmit({ category0: { quantity: null, product: null } });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          cartDraft: getCartDraft(),
        },
      });
    });

    describe('when cart creation succeeds', () => {
      const cart = omitDeep(getCartDraft(selections), 'custom');
      let wrapper;

      beforeEach(() => {
        setMutation({ data: { createCart: cart } });
        wrapper = loadBundlePreview();
        wrapper.find(Formik).props().onSubmit(formValues);
      });

      it('should display cart draft as formatted json', () => {
        expect(wrapper.find('[data-testid="draft-cart"]').prop('json')).toEqual(
          getCartDraft(selections)
        );
      });

      it('should display created cart as formatted json', () => {
        expect(
          wrapper.find('[data-testid="created-cart"]').prop('json')
        ).toEqual(cart);
      });

      it('should scroll cart preview into view', () => {
        expect(mockRef.current.scrollIntoView).toHaveBeenCalled();
      });
    });

    it('when cart creation fails, should display error notification', async () => {
      const message = 'creation failed';
      setMutation({ error: { message } });
      const wrapper = loadBundlePreview();
      try {
        await wrapper.find(Formik).props().onSubmit(formValues);
      } catch (err) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(mockShowNotification).toHaveBeenCalledWith({
          text: messages.addToCartError.id,
        });
      }
    });
  });
});
