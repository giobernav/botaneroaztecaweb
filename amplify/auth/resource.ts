import { defineAuth } from "@aws-amplify/backend";
// import { cognitoGetUserFcn } from "../functions/cognitoGetUser/resource";
// import { postConfirmationFcn } from "./post-confirmation/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    phone: true,
  },
  groups: ["admin", "manager", "everyone"],
  // triggers: {
  //   postConfirmation: postConfirmationFcn,
  // },
  // access: (allow) => [
  //   allow.resource(cognitoGetUserFcn).to(["getUser"]),
  //   allow.resource(postConfirmationFcn).to(["addUserToGroup"]),
  // ],
});
