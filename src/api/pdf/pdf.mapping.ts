import {TemplateAttributes, TemplateGroup, TemplateSpecify} from '@/types';
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
    mergeTemplate: TemplateAttributes[],
    buildTemplate: TemplateAttributes[]
  } = {
    mergeTemplate: [],
    buildTemplate: [],
  };

  templates.forEach((template) => {
    if (
      template.group === TemplateGroup.Introduction ||
      template.group === TemplateGroup.Preamble
    ) {
      response.mergeTemplate.push(template);
    } else {
      response.buildTemplate.push(template);
    }
  });

  return response;
}
