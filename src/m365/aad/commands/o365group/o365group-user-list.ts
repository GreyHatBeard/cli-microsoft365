import { User } from '@microsoft/microsoft-graph-types';
import { Logger } from '../../../../cli';
import {
  CommandOption
} from '../../../../Command';
import GlobalOptions from '../../../../GlobalOptions';
import Utils from '../../../../Utils';
import { GraphItemsListCommand } from '../../../base/GraphItemsListCommand';
import commands from '../../commands';

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  role?: string;
  groupId: string;
}

class AadO365GroupUserListCommand extends GraphItemsListCommand<User> {
  public get name(): string {
    return commands.O365GROUP_USER_LIST;
  }

  public get description(): string {
    return "Lists users for the specified Microsoft 365 group";
  }

  public getTelemetryProperties(args: CommandArgs): any {
    const telemetryProps: any = super.getTelemetryProperties(args);
    telemetryProps.role = args.options.role;
    return telemetryProps;
  }

  public commandAction(logger: Logger, args: CommandArgs, cb: () => void): void {
    this
      .getOwners(logger, args.options.groupId)
      .then((): Promise<void> => {
        if (args.options.role === "Owner") {
          return Promise.resolve();
        }

        return this.getMembersAndGuests(logger, args.options.groupId);
      })
      .then(
        (): void => {
          if (args.options.role) {
            this.items = this.items.filter(i => i.userType === args.options.role);
          }

          logger.log(this.items);
          cb();
        },
        (err: any): void => this.handleRejectedODataJsonPromise(err, logger, cb)
      );
  }

  private getOwners(logger: Logger, groupId: string): Promise<void> {
    const endpoint: string = `${this.resource}/v1.0/groups/${groupId}/owners?$select=id,displayName,userPrincipalName,userType`;

    return this.getAllItems(endpoint, logger, true).then(
      (): void => {
        // Currently there is a bug in the Microsoft Graph that returns Owners as
        // userType 'member'. We therefore update all returned user as owner
        for (const i in this.items) {
          this.items[i].userType = "Owner";
        }
      }
    );
  }

  private getMembersAndGuests(logger: Logger, groupId: string): Promise<void> {
    const endpoint: string = `${this.resource}/v1.0/groups/${groupId}/members?$select=id,displayName,userPrincipalName,userType`;
    return this.getAllItems(endpoint, logger, false);
  }

  public options(): CommandOption[] {
    const options: CommandOption[] = [
      {
        option: "-i, --groupId <groupId>"
      },
      {
        option: "-r, --role [type]",
        autocomplete: ["Owner", "Member", "Guest"]
      }
    ];

    const parentOptions: CommandOption[] = super.options();
    return options.concat(parentOptions);
  }

  public validate(args: CommandArgs): boolean | string {
    if (!Utils.isValidGuid(args.options.groupId as string)) {
      return `${args.options.groupId} is not a valid GUID`;
    }

    if (args.options.role) {
      if (['Owner', 'Member', 'Guest'].indexOf(args.options.role) === -1) {
        return `${args.options.role} is not a valid role value. Allowed values Owner|Member|Guest`;
      }
    }

    return true;
  }
}

module.exports = new AadO365GroupUserListCommand();