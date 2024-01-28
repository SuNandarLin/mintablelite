import dynamoDBClient from "../model/index";
import MintableItemService from "./service"
const mintableItemService = new MintableItemService(dynamoDBClient());
export default mintableItemService;
