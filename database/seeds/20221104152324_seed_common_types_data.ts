import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {v4 as uuid} from 'uuid';
import moment from 'moment';
import {COMMON_TYPES} from '@/constants';

const records = [
  {
    "type": COMMON_TYPES.SHARING_GROUP,
    "name": "Architects/Interior Designers"
  },
  { "type": COMMON_TYPES.SHARING_GROUP, "name": "Builders/Contractors" },
  { "type": COMMON_TYPES.SHARING_GROUP, "name": "Clients/Customers" },
  { "type": COMMON_TYPES.SHARING_GROUP, "name": "Distributors/Sales Agents" },
  { "type": COMMON_TYPES.SHARING_GROUP, "name": "Internal Team Members" },
  {
    "type": COMMON_TYPES.SHARING_GROUP,
    "name": "Other Professional Consultants"
  },
  { "type": COMMON_TYPES.SHARING_PURPOSE, "name": "Approval/Confirmation" },
  { "type": COMMON_TYPES.SHARING_PURPOSE, "name": "Comment/Feedback" },
  { "type": COMMON_TYPES.SHARING_PURPOSE, "name": "General Review/Sharing" },
  {
    "type": COMMON_TYPES.SHARING_PURPOSE,
    "name": "Internal Evaluation/Discussion"
  },
  {
    "type": COMMON_TYPES.SHARING_PURPOSE,
    "name": "Project Proposal/Submission"
  },
  {
    "type": COMMON_TYPES.SHARING_PURPOSE,
    "name": "Recommendation/Suggestion"
  },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Base @ Celling + Floor" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Base @ Celling" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Base @ Floor" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Cabinet Carcass + Door" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Cabinet Carcass" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Cabinet Door" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Celling Surface" },
  {
    "type": COMMON_TYPES.FINISH_SCHEDULES,
    "name": "Door Frame + Door Panel"
  },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Door Frame" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Door Panel" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Floor Surface" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Wall Surface" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Wall-East" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Wall-South" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Wall-West" },
  { "type": COMMON_TYPES.FINISH_SCHEDULES, "name": "Wall-North" },
  { "type": COMMON_TYPES.COMPANY_FUNCTIONAL, "name": "Business Office" },
  { "type": COMMON_TYPES.COMPANY_FUNCTIONAL, "name": "Headquarter" },
  { "type": COMMON_TYPES.COMPANY_FUNCTIONAL, "name": "Regional Office" },
  { "type": COMMON_TYPES.COMPANY_FUNCTIONAL, "name": "Local Office" },
  { "type": COMMON_TYPES.COMPANY_FUNCTIONAL, "name": "Experience Center" },
  { "type": COMMON_TYPES.COMPANY_FUNCTIONAL, "name": "Showroom & Gallery" },
  {
    "type": COMMON_TYPES.COMPANY_FUNCTIONAL,
    "name": "Customer & Service Center"
  },
  {
    "type": COMMON_TYPES.COMPANY_FUNCTIONAL,
    "name": "Factory & Fabrication Shop"
  },
  {
    "type": COMMON_TYPES.COMPANY_FUNCTIONAL,
    "name": "Logistic Facility & Warehouse"
  },
  { "type": COMMON_TYPES.PROJECT_BUILDING, "name": "Addition & Alteration" },
  { "type": COMMON_TYPES.PROJECT_BUILDING, "name": "Concept & Competition" },
  {
    "type": COMMON_TYPES.PROJECT_BUILDING,
    "name": "Conversation & Restoration"
  },
  {
    "type": COMMON_TYPES.PROJECT_BUILDING,
    "name": "Iterior Fit-out & Renovation"
  },
  {
    "type": COMMON_TYPES.PROJECT_BUILDING,
    "name": "Landscaping & Outdoorm Space"
  },
  {
    "type": COMMON_TYPES.PROJECT_BUILDING,
    "name": "Master & Urban Planning"
  },
  {
    "type": COMMON_TYPES.PROJECT_BUILDING,
    "name": "New Building & Construction"
  },
  {
    "type": COMMON_TYPES.PROJECT_INSTRUCTION,
    "name": "Image included for reference only"
  },
  {
    "type": COMMON_TYPES.PROJECT_INSTRUCTION,
    "name": "Refer to control sample for actual finish"
  },
  {
    "type": COMMON_TYPES.PROJECT_INSTRUCTION,
    "name": "Product conforms to code and regulation"
  },
  {
    "type": COMMON_TYPES.PROJECT_INSTRUCTION,
    "name": "Product conforms to industry standards"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Airport, Station, Transportation Hub"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Apartment, Condo, Multi-unit Housing"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Arena, Sports Hall, Stadium"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Bank Building, High-Security Facility"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Club, Entertainment, Gaming Complex"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Cultural Space, Gallery, Museum"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Commerce, Retail Store, Shopping Mall"
  },
  { "type": COMMON_TYPES.PROJECT_TYPE, "name": "Data Center, IT Facility" },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Distribution Center, Factory, Warehouse"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Educational Space, Library, School"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Food & Beverage, Hospitality Outlet"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Government, Institutional Building"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Healthcare, Hospital, Medical Facility"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Hotel, Resort, Motel, Lodging Facility"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Landscaping, Park, Playground"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Meetings, Incentives, Conferences, Exhibitions"
  },
  { "type": COMMON_TYPES.PROJECT_TYPE, "name": "Mixed-Use Development" },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Office Building, Workplace Space"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Prison, Confinement Facility"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Public Space, Monument, Open Plaza"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Religion Building, Worship Facility"
  },
  {
    "type": COMMON_TYPES.PROJECT_TYPE,
    "name": "Single House, Private Residence"
  },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "Cutting" },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "Finishing Sample" },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "Flame Certificate" },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "LEED Certificate" },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "Prototype" },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "Seaming Diagram" },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "Shop Drawings" },
  { "type": COMMON_TYPES.PROJECT_REQUIREMENT, "name": "Strike-off" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Not Applicable" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Average" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bag" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bale" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Band" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bar" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Barrel" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bin" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Block" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Board Feet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bolt" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bottle" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Box" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bowl" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bucket" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bulk" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Bundle" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Can" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Capsule" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Card" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Carton" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cartridge" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Case" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cassette" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Centimeter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Coil" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Container" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cord" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Count" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Crate" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cubic Centimeter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cubic Feet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cubic Inche" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cubic Meter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cubic Yard" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cup" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Cylinder" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Diameter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Display" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Dozen" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Drum" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Each" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Feet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Gallon" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Gauge" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Grain" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Gram" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Gross" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Hank" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Inch" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Jar" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Jug" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Keg" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Kilogram" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Kit" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Length" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Linear Centimeter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Linear Foot" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Linear Meter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Linear Yard" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Link" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Liter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Lot" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Meter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Order" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Ounce" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Pack" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Package" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Packet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Pad" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Page" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Pail" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Pair" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Pallet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Piece" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Pint" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Plate" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Pound" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Quart" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Quarter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Rack" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Ream" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Reel" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Rod" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Roll" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Sachet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Sack" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Set" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Sheet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Single" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Sleeve" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Spool" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Square Foot" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Square Meter" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Square Yard" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Stack" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Tablet" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Tank" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Tray" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Ton" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Tub" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Tube" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Unit" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Vial" },
  { "type": COMMON_TYPES.PROJECT_UNIT, "name": "Yard" },

  { "type": COMMON_TYPES.DEPARTMENT, "name": "Accounting/Finance" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Communication & PR" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Corporate & Management" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Client/Customer Service" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Design & Creativity" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Human Resource" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Legal & Advisory" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Marketing & Sales" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Operation & Project Management" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Production & Manufacturing" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "Research & Development" },
  { "type": COMMON_TYPES.DEPARTMENT, "name": "3rd Party & External Consultant" },

  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Brochure/Catalogue" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Demonstration & Performance Review" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Lunch & Learn" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Request Project Proposal" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Request Project Quotation" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Sample Submission" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Showroom Visit" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Technical Documentation" },
  { "type": COMMON_TYPES.REQUEST_FOR, "name": "Update Material Library & Resource Room" },

  { "type": COMMON_TYPES.ACTION_TASK, "name": "Call follow up" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Design office visit" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Design office visit" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Email follow up" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Internal discussion & review" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Invite showroom visit" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Personal meetup" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Project site visit" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Share inquiry with distributor" },
  { "type": COMMON_TYPES.ACTION_TASK, "name": "Submit required info" },

  { "type": COMMON_TYPES.ISSUE_FOR, "name": "Client Approval" },
  { "type": COMMON_TYPES.ISSUE_FOR, "name": "Construction Documents" },
  { "type": COMMON_TYPES.ISSUE_FOR, "name": "Internal Review" },
  { "type": COMMON_TYPES.ISSUE_FOR, "name": "Tender Prequlification" },
  { "type": COMMON_TYPES.ISSUE_FOR, "name": "Tender Documents" },

  { "type": COMMON_TYPES.CAPABILITIES, "name": "Architecture" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Branding" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Design & Build" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Furniture Design" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Graphic Design" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Industry Design" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Interior Design" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Landscape Design" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Lighting Design" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Master Planning" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Multimedia Design" },
  { "type": COMMON_TYPES.CAPABILITIES, "name": "Product Design" }
];

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  return connection.insert(
    'common_types', records.map((item) => ({
      id: uuid(),
      type: item.type,
      name: item.name,
      created_at: currentTime,
      updated_at: currentTime,
      deleted_at: null,
      relation_id: null
    }))
  );
}
