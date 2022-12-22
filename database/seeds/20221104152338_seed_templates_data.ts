import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {TemplateGroup} from '@/types';
import moment from 'moment';

const templateData = [
	{
    "id": "71c56f24-3d07-4b19-ab60-617c3c0a36ae",
    "name": "Guideline",
    "preview_url": "/templates/introduction/Guideline.jpg",
    "pdf_url": "/templates/introduction/Guideline.pdf",
    "group": TemplateGroup.Introduction
	},
	{
    "id": "19349bc6-fd1c-4f4c-9ed4-0869a85b4b54",
    "name": "Copyright & Protocol",
    "preview_url": "/templates/introduction/Copyright-and-Protocol.jpg",
    "pdf_url": "/templates/introduction/Copyright-and-Protocol.pdf",
    "group": TemplateGroup.Introduction
	},
	{
    "id": "a9b2a0d4-3698-4af6-bc1f-83cbdaea7663",
    "name": "Principals & Definitions",
    "preview_url": "/templates/introduction/Principals-and-Definitions.jpg",
    "pdf_url": "/templates/introduction/Principals-and-Definitions.pdf",
    "group": TemplateGroup.Introduction
	},
	{
    "id": "240d55ac-6dd6-4baf-8006-85aa2f5a2b45",
    "name": "Submittal & Review",
    "preview_url": "/templates/introduction/Submittal-and-Review.jpg",
    "pdf_url": "/templates/introduction/Submittal-and-Review.pdf",
    "group": TemplateGroup.Introduction
	},
	{
    "id": "6121750d-e362-40c4-b866-a22396a3e085",
    "name": "General Conditions",
    "preview_url": "/templates/introduction/General-Conditions.jpg",
    "pdf_url": "/templates/introduction/General-Conditions.pdf",
    "group": TemplateGroup.Introduction
	},
	{
    "id": "bf2da4ea-8c77-40d8-b46d-13f53aeaab3d",
    "name": "Appliances & Equipment Integration",
    "preview_url": "/templates/preambles/Appliances-And-Equipment-Integration.jpg",
    "pdf_url": "/templates/preambles/Appliances-And-Equipment-Integration.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "cb958c1b-a6bb-4916-9b95-03823db44776",
    "name": "Architectural Metals",
    "preview_url": "/templates/preambles/Architectural-Metals.jpg",
    "pdf_url": "/templates/preambles/Architectural-Metals.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "9c9d2c52-7aa0-475c-aa17-5d1f9bebcccc",
    "name": "Artwork",
    "preview_url": "/templates/preambles/Artwork.jpg",
    "pdf_url": "/templates/preambles/Artwork.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "90fd87f0-aed7-43ce-849e-9590c8413722",
    "name": "Carpets & Rugs",
    "preview_url": "/templates/preambles/Carpets-And-Rugs.jpg",
    "pdf_url": "/templates/preambles/Carpets-And-Rugs.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "4244d83e-f486-4ba6-8813-ab0fce8927d9",
    "name": "Casework Joinery & Millwork",
    "preview_url": "/templates/preambles/Casework-Joinery-And-Millwork.jpg",
    "pdf_url": "/templates/preambles/Casework-Joinery-And-Millwork.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "e49d0f22-c713-4ddd-b475-bdb7f93b59af",
    "name": "Drapery",
    "preview_url": "/templates/preambles/Drapery.jpg",
    "pdf_url": "/templates/preambles/Drapery.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "a32417a7-349c-4598-bbcb-0dbe75309a8c",
    "name": "Fabrics & Leather",
    "preview_url": "/templates/preambles/Fabrics-And-Leather.jpg",
    "pdf_url": "/templates/preambles/Fabrics-And-Leather.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "5bed1c8a-f35a-4410-89bc-37cb9226109a",
    "name": "Finish Upholstery",
    "preview_url": "/templates/preambles/Finish-Upholstery.jpg",
    "pdf_url": "/templates/preambles/Finish-Upholstery.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "17b714ed-c802-43bc-9292-b7d141492bde",
    "name": "Glass & Mirror",
    "preview_url": "/templates/preambles/Glass-And-Mirror.jpg",
    "pdf_url": "/templates/preambles/Glass-And-Mirror.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "d5ff7570-784c-4402-b030-771f4633b572",
    "name": "Hardware & Ironmongery",
    "preview_url": "/templates/preambles/Hardware-And-Ironmongery.jpg",
    "pdf_url": "/templates/preambles/Hardware-And-Ironmongery.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "32a22f51-8b0d-4f3b-adbc-1b19a26d0c40",
    "name": "Lamps & Lighting Fixtures",
    "preview_url": "/templates/preambles/Lamps-And-Lighting-Fixtures.jpg",
    "pdf_url": "/templates/preambles/Lamps-And-Lighting-Fixtures.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "351e4f8b-89a8-4359-9812-a3339a746eae",
    "name": "Light Control & Equipment",
    "preview_url": "/templates/preambles/Light-Control-And-Equipment.jpg",
    "pdf_url": "/templates/preambles/Light-Control-And-Equipment.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "5787c237-fbb2-4bb1-b4fe-4c0876630a5f",
    "name": "Paints",
    "preview_url": "/templates/preambles/Paints.jpg",
    "pdf_url": "/templates/preambles/Paints.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "5458499c-ba8c-4f87-baac-9809a14587f7",
    "name": "Plumbing & Fixtures",
    "preview_url": "/templates/preambles/Plumbing-And-Fixtures.jpg",
    "pdf_url": "/templates/preambles/Plumbing-And-Fixtures.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "cab7939e-0c48-46e7-bed8-47a4848fe066",
    "name": "Special Coating & Finishing",
    "preview_url": "/templates/preambles/Special-Coating-And-Finishing.jpg",
    "pdf_url": "/templates/preambles/Special-Coating-And-Finishing.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "6b2403b0-6f63-4886-9233-7e97c11591e1",
    "name": "Special Equipment",
    "preview_url": "/templates/preambles/Special-Equipment.jpg",
    "pdf_url": "/templates/preambles/Special-Equipment.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "85cf6f18-6cf8-4f92-beae-d078c424a66b",
    "name": "Stone & Tile",
    "preview_url": "/templates/preambles/Stone-And-Tile.jpg",
    "pdf_url": "/templates/preambles/Stone-And-Tile.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "d3aa13f9-959d-4c7e-840f-496a5bbecb47",
    "name": "Timber Veneer & Lacquer",
    "preview_url": "/templates/preambles/Timber-Veneer-And-Lacquer.jpg",
    "pdf_url": "/templates/preambles/Timber-Veneer-And-Lacquer.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "886cf7c3-c7d8-49d4-b523-82e9f80d0dce",
    "name": "Wallcovering",
    "preview_url": "/templates/preambles/Wallcovering.jpg",
    "pdf_url": "/templates/preambles/Wallcovering.pdf",
    "group": TemplateGroup.Preamble
	},
	{
    "id": "1706ad30-226b-4782-bc6e-059f4ee1631c",
    "name": "Brands & Distributors Listing by Category",
    "preview_url": "/templates/specification/brand-distributor/Brand-And-Distributor-Listing-By-Category.jpg",
    "pdf_url": "",
    "group": TemplateGroup.BrandsAndDistributors
	},
	{
    "id": "c28b45df-7fc0-462b-9f01-ca4875544bf1",
    "name": "Brand Contact Reference by Category",
    "preview_url": "/templates/specification/brand-distributor/Brand-Contact-Reference-By-Category.jpg",
    "pdf_url": "",
    "group": TemplateGroup.BrandsAndDistributors
	},
	{
    "id": "0290549d-ada8-4626-8e43-7605c2342085",
    "name": "Distributor Contact Reference by Category",
    "preview_url": "/templates/specification/brand-distributor/Distributor-Contact-Reference-By-Category.jpg",
    "pdf_url": "",
    "group": TemplateGroup.BrandsAndDistributors
	},
	{
    "id": "c1499bb8-e26d-4da3-8cf2-7b25df6b7705",
    "name": "Finished, Materials & Products Listing by Brand",
    "preview_url": "/templates/specification/finish-material-product/Listing-By-Brand.jpg",
    "pdf_url": "",
    "group": TemplateGroup.FinishesMaterialAndProducts
	},
	{
    "id": "4c5ac234-f049-4699-8c59-f2d5b66d4e2e",
    "name": "Finished, Materials & Products Listing by Code",
    "preview_url": "/templates/specification/finish-material-product/Listing-By-Code.jpg",
    "pdf_url": "",
    "group": TemplateGroup.FinishesMaterialAndProducts
	},
	{
    "id": "dcaf5bad-633f-4677-8a5f-5677fb0525d1",
    "name": "Finished, Materials & Products Reference by Brand",
    "preview_url": "/templates/specification/finish-material-product/Reference-By-Brand.jpg",
    "pdf_url": "",
    "group": TemplateGroup.FinishesMaterialAndProducts
	},
	{
    "id": "b5b6d876-d0ec-4c22-85d1-a95213a35ef0",
    "name": "Finished, Materials & Products Reference by Code",
    "preview_url": "/templates/specification/finish-material-product/Reference-By-Code.jpg",
    "pdf_url": "",
    "group": TemplateGroup.FinishesMaterialAndProducts
	},
	{
    "id": "79ea6da5-0880-4d95-a617-d0b7817a3552",
    "name": "Finish Schedule by Room",
    "preview_url": "/templates/specification/schedule-specification/Finish-Schedule-By-Room.jpg",
    "pdf_url": "",
    "group": TemplateGroup.SchedulesAndSpecifications
	},
	{
    "id": "35753d1c-c6b3-4438-bdfe-6311ca0f2fcb",
    "name": "Finishes, Materials & Products Specification",
    "preview_url": "/templates/specification/schedule-specification/Finishes-Materials-And-Products-Specification.jpg",
    "pdf_url": "",
    "group": TemplateGroup.SchedulesAndSpecifications
	},
	{
    "id": "a1625d5b-3256-4a31-b2a8-b70975af4d01",
    "name": "Project Summary Listing by Area",
    "preview_url": "/templates/specification/zone-area-room/project-summary-listing-by-area.jpg",
    "pdf_url": "",
    "group": TemplateGroup.ZonesAreasRooms
	},
	{
    "id": "72ea2365-ab84-400c-8ffe-25e39328aeb0",
    "name": "Inventory Summary Listing by Room",
    "preview_url": "/templates/specification/zone-area-room/inventory-summary-listing-by-room.jpg",
    "pdf_url": "",
    "group": TemplateGroup.ZonesAreasRooms
	},
	{
    "id": "c7a41e52-927a-4b07-a77f-5c485773d3a9",
    "name": "Inventory Reference by Code",
    "preview_url": "/templates/specification/zone-area-room/inventory-reference-by-code.jpg",
    "pdf_url": "",
    "group": TemplateGroup.ZonesAreasRooms
	}
];

export const up = (connection: ConnectionInterface) => {
  const data = templateData.reduce((res, template, currentIndex) => {
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    res.push({
      ...template,
      sequence: currentIndex + 1,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    })
    return res;
  }, [] as any);
  return connection.insert( 'templates', data );
}
