import {TemplateAttributes, TemplateGroup, TemplateSpecify, TemplateGroupValue} from '@/types';
import {mapValues, isEmpty} from 'lodash';

export const mappingSpecifyPDFTemplate = (templates: TemplateAttributes[]) => {
  const templatesResponse: TemplateSpecify = {
    cover: [
      {
        name: 'Introduction (recommended)',
        items: []
      },
      {
        name: 'Standard Preambles (select relevant ones)',
        items: []
      },
    ],
    specification: [
      {
        name: 'Brands & Distributors',
        items: []
      },
      {
        name: 'Finishes, Materials & Products',
        items: []
      },
      {
        name: 'Schedules & Specifications',
        items: []
      },
      {
        name: 'Zones / Areas / Rooms',
        items: []
      },
    ]
  }
  templates.forEach((template) => {
    if (template.group === TemplateGroup.Introduction) {
      templatesResponse.cover[0].items.push(template);
    }
    if (template.group === TemplateGroup.Preamble) {
      templatesResponse.cover[1].items.push(template);
    }
    if (template.group === TemplateGroup.BrandsAndDistributors) {
      templatesResponse.specification[0].items.push(template);
    }
    if (template.group === TemplateGroup.FinishesMaterialAndProducts) {
      templatesResponse.specification[1].items.push(template);
    }
    if (template.group === TemplateGroup.SchedulesAndSpecifications) {
      templatesResponse.specification[2].items.push(template);
    }
    if (template.group === TemplateGroup.ZonesAreasRooms) {
      templatesResponse.specification[3].items.push(template);
    }
  });

  /// filter empty items
  return mapValues(templatesResponse, (data) => {
    return data.filter(item => !isEmpty(item.items));
  });
}

export const groupSpecifyTemplates = (templates: TemplateAttributes[]) => {
  const response: {
    introTemplates: TemplateAttributes[],
    specificationTemplates: {
      [key: TemplateGroupValue]: TemplateAttributes[]
    }
  } = {
    introTemplates: [],
    specificationTemplates: {
      [TemplateGroup.BrandsAndDistributors]: [],
      [TemplateGroup.FinishesMaterialAndProducts]: [],
      [TemplateGroup.SchedulesAndSpecifications]: [],
      [TemplateGroup.ZonesAreasRooms]: [],
    },
  };

  templates.forEach((template) => {
    if (
      template.group === TemplateGroup.Introduction ||
      template.group === TemplateGroup.Preamble
    ) {
      response.introTemplates.push(template);
    } else {
      response.specificationTemplates[template.group].push(template);
    }
  });

  return response;
}

export const findEjsTemplatePath = (key: string) => {
  const response = {
    ///
    'Brands & Distributors Listing by Category': 'brand_distributor/listing_by_category.ejs',
    'Brand Contact Reference by Category': 'brand_distributor/brand_contact_reference_by_category.ejs',
    'Distributor Contact Reference by Category': 'brand_distributor/distributor_contact_by_category.ejs',
    ///
    'Finished, Materials & Products Listing by Brand': 'finishes_material_products/listing_by_brand.ejs',
    'Finished, Materials & Products Listing by Code': 'finishes_material_products/listing_by_code.ejs',
    'Finished, Materials & Products Reference by Brand': 'finishes_material_products/reference_by_brand.ejs',
    'Finished, Materials & Products Reference by Code': 'finishes_material_products/reference_by_code.ejs',
    ///
    'Finish Schedule by Room': 'schedule_specification/finish_by_room.ejs',
    'Finishes, Materials & Products Specification': 'schedule_specification/specification.ejs',
    ///
    'Project Summary Listing by Area': 'zone_area_room/area.ejs',
    'Inventory Summary Listing by Room': 'zone_area_room/room.ejs',
    'Inventory Reference by Code': 'zone_area_room/code.ejs',
  } as any;
  return response[key] as string | undefined;
}
