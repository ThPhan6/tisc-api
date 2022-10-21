import {TemplateAttributes, TemplateGroup, TemplateSpecify, TemplateGroupValue} from '@/types';
import {mapValues, isEmpty, uniqBy, uniqWith, isEqual, uniq} from 'lodash';
import {formatNumberDisplay} from '@/helper/common.helper';

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
    'Brands & Distributors Listing by Category': {
      group: 'category',
      path: 'brand_distributor/listing_by_category.ejs'
    },
    'Brand Contact Reference by Category': {
      group: 'category',
      path: 'brand_distributor/brand_contact_reference_by_category.ejs'
    },
    'Distributor Contact Reference by Category': {
      group: 'category',
      path: 'brand_distributor/distributor_contact_by_category.ejs'
    },
    ///
    'Finished, Materials & Products Listing by Brand': {
      group: 'brand',
      path: 'finishes_material_products/listing_by_brand.ejs'
    },
    'Finished, Materials & Products Listing by Code': {
      group: 'material_code_sub_list',
      path: 'finishes_material_products/listing_by_code.ejs'
    },
    'Finished, Materials & Products Reference by Brand': {
      group: 'brand_distributor',
      path: 'finishes_material_products/reference_by_brand.ejs'
    },
    'Finished, Materials & Products Reference by Code': {
      path: 'finishes_material_products/reference_by_code.ejs'
    },
    ///
    'Finish Schedule by Room': {
      group: 'finish_schedule',
      path: 'schedule_specification/finish_by_room.ejs'
    },
    'Finishes, Materials & Products Specification': {
      path: 'schedule_specification/specification.ejs'
    },
    ///
    'Project Summary Listing by Area': {
      path: 'zone_area_room/area.ejs'
    },
    'Inventory Summary Listing by Room': {
      group: 'code_by_room',
      path: 'zone_area_room/room.ejs'
    },
    'Inventory Reference by Code': {
      path: 'zone_area_room/code.ejs'
    },
  } as any;
  return response[key] as {
    path: string;
    group?: 'category' | 'brand' | 'brand_distributor' | 'finish_schedule' | 'code_by_room' | 'material_code_sub_list'
  } | undefined;
}


export const mappingPdfDataByBrand = (data: any) => {
  const uniqBrands = uniqBy(
    data.reduce((res :any, item: any) => res.concat(item.product.brand), []),
    'id'
  );
  return uniqBrands.map((brand: any) => {
    const groupData = data.filter((item: any) =>
      item.product.brand.id === brand.id
    );
    ///
    return {
      ...brand,
      data: groupData,
    };
  });
}

export const mappingPdfDataByLocationAndDistributor = (data: any) => {

  const uniqDistributorAndLocation = uniqWith(
    data.reduce((res :any, item: any) => res.concat({
      location: item.location,
      distributor: item.distributor,
      brand: item.product.brand,
    }), []),
    isEqual
  );
  return uniqDistributorAndLocation.map((distributorLoc: any) => {
    const filterByVendor = data.filter((item: any) => {
      return item.location.id === distributorLoc.location.id &&
        item.distributor.id === distributorLoc.distributor.id &&
        item.product.brand.id === distributorLoc.brand.id
    });

    return {
      ...distributorLoc,
      data: filterByVendor,
    };
  });
}

export const mappingPdfDataByCategory = (data: any) => {
  const uniqCategories = uniqBy(
    data.reduce((res :any, item: any) => res.concat(item.product.categories), []),
    'id'
  );
  return uniqCategories.map((category: any) => {
    const groupData = data.filter((item: any) =>
      item.product.category_ids.includes(category.id)
    );
    ///
    return {
      ...category,
      data: groupData,
    };
  });
}

export const mappingFinishSchedules = (data: any) => {
  const response: any = [];
  const codes: any = [];
  data.forEach((item: any) => {
    codes.push({
      ...item.material_code,
      requirementTypes: item.requirementTypes,
      instructionTypes: item.instructionTypes
    });
    item.finish_schedules.forEach((finishSchedule: any) => {
      let index = response.findIndex((sub: any) => {
        return sub.room_uuid == finishSchedule.room_uuid;
      });
      if (index == -1) {
        index = response.length;
        response[index] = {
          room_uuid: finishSchedule.room_uuid,
          room_id: finishSchedule.room_id,
          room_name: finishSchedule.room_name,
          room_size: finishSchedule.room_size,
          quantity: finishSchedule.quantity,
          sub_total: finishSchedule.sub_total,
          finishSchedules: []
        };
      }
      response[index].finishSchedules.push({
        ...finishSchedule,
        material_code: item.material_code
      });
    });
  })
  return {
    finishSchedules: response,
    codes: uniqWith(codes, isEqual)
  }
}

export const mappingCodeByRoom = (data: any) => {
  const response: any = [];
  data.forEach((item: any) => {
    item.finish_schedules.forEach((finishSchedule: any) => {
      let index = response.findIndex((sub: any) => {
        return sub.room_uuid == finishSchedule.room_uuid;
      });
      if (index == -1) {
        index = response.length;
        response[index] = {
          room_uuid: finishSchedule.room_uuid,
          room_id: finishSchedule.room_id,
          room_name: finishSchedule.room_name,
          room_size: finishSchedule.room_size,
          quantity: finishSchedule.quantity,
          sub_total: finishSchedule.sub_total,
          data: []
        };
      }
      response[index].data.push({
        material_code: item.material_code,
        unitType: item.unitType,
        quantity: item.quantity,
        order_method: item.order_method,
      });
    });
  });
  return response;
}
export const mappingPdfZoneArea = (data: any) => {
  const response = {
    total: 0,
    zones: []
  } as any;
  response.zones = data.map((zone: any) => {
    response.total += zone.total_size;
    return {
      ...zone,
      total_size: formatNumberDisplay(zone.total_size),
      areas: zone.areas.map((area: any) => {
        return {
          ...area,
          total_size: formatNumberDisplay(area.total_size),
          rooms: area.rooms.map((room: any) => {
            return {
              ...room,
              total_size: formatNumberDisplay(room.quantity * room.room_size),
            }
          })
        }
      })
    }
  });
  return {
    total_size: formatNumberDisplay(response.total),
    data: response.zones
  };
}

export const mappingMaterialCode = (data: any) => {
  const uniqMaterialSublist = uniq(data.reduce((res :any, item: any) => res.concat(item.master_material_code_name), []));
  return uniqMaterialSublist.map((materialSubListName: any) => {
    const groupData = data.filter((item: any) =>
      item.master_material_code_name == materialSubListName
    );
    ///
    return {
      name: materialSubListName,
      data: groupData,
    };
  });

}
