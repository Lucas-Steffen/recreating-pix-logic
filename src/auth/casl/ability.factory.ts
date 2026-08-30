import { AbilityBuilder, createMongoAbility, MongoAbility, MongoQuery } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Users } from "src/users/models/user.entity";
import { Subjects } from "../models/enums/casl.subject";
import { Action } from "../models/enums/casl.action";

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: Users) {
        const { can, cannot, build } = new AbilityBuilder<
            MongoAbility<[Action, Subjects], MongoQuery>
        >(createMongoAbility)

        for (const role of user.roles){
            for (const permissions of role.permissions){
                can(permissions.action as Action, permissions.subject)
            }
        }

        return build()
    }
}