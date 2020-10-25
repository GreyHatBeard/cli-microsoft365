import * as chalk from 'chalk';
import { Logger } from '../../../../cli';
import { CommandOption } from '../../../../Command';
import GlobalOptions from '../../../../GlobalOptions';
import request from '../../../../request';
import Utils from '../../../../Utils';
import { GraphItemsListCommand } from '../../../base/GraphItemsListCommand';
import commands from '../../commands';
import { Team } from '../../Team';
import { TeamsApp } from '../../TeamsApp';
import { TeamsAppInstallation } from '../../TeamsAppInstallation';

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  all?: boolean;
  teamId?: string;
  teamName?: string;
}

class TeamsAppListCommand extends GraphItemsListCommand<TeamsApp> {
  public get name(): string {
    return `${commands.TEAMS_APP_LIST}`;
  }

  public get description(): string {
    return 'Lists apps from the Microsoft Teams app catalog or apps installed in the specified team';
  }

  public getTelemetryProperties(args: CommandArgs): any {
    const telemetryProps: any = super.getTelemetryProperties(args);
    telemetryProps.all = args.options.all || false;
    telemetryProps.teamId = typeof args.options.teamId !== 'undefined';
    telemetryProps.teamName = typeof args.options.teamName !== 'undefined';
    return telemetryProps;
  }

  private getTeamId(args: CommandArgs): Promise<string> {
    if (args.options.teamId) {
      return Promise.resolve(args.options.teamId);
    }

    const teamRequestOptions: any = {
      url: `${this.resource}/v1.0/me/joinedTeams?$filter=displayName eq '${encodeURIComponent(args.options.teamName as string)}'`,
      headers: {
        accept: 'application/json;odata.metadata=none'
      },
      responseType: 'json'
    };

    return request
      .get<{ value: Team[] }>(teamRequestOptions)
      .then(response => {
        const teamItem: Team | undefined = response.value[0];

        if (!teamItem) {
          return Promise.reject(`The specified team does not exist in the Microsoft Teams`);
        }

        if (response.value.length > 1) {
          return Promise.reject(`Multiple Microsoft Teams teams with name ${args.options.teamName} found: ${response.value.map(x => x.id)}`);
        }

        return Promise.resolve(teamItem.id);
      });
  }

  private getEndpointUrl(args: CommandArgs): Promise<string> {
    return new Promise<string>((resolve: (endpoint: string) => void, reject: (error: string) => void): void => {
      if (args.options.teamId || args.options.teamName) {
        this
          .getTeamId(args)
          .then((teamId: string): void => {
            let endpoint: string = `${this.resource}/v1.0/teams/${encodeURIComponent(teamId)}/installedApps?$expand=teamsApp`;

            if (!args.options.all) {
              endpoint += `&$filter=teamsApp/distributionMethod eq 'organization'`;
            }

            return resolve(endpoint);
          })
          .catch((err: any) => {
            reject(err);
          });
      }
      else {
        let endpoint: string = `${this.resource}/v1.0/appCatalogs/teamsApps`;

        if (!args.options.all) {
          endpoint += `?$filter=distributionMethod eq 'organization'`;
        }

        return resolve(endpoint);
      }
    });
  }

  public commandAction(logger: Logger, args: CommandArgs, cb: (err?: any) => void): void {
    this
      .getEndpointUrl(args)
      .then((endpoint: string): Promise<void> => this.getAllItems(endpoint, logger, true))
      .then((): void => {
        if (args.options.output === 'json') {
          logger.log(this.items);
        }
        else {
          if (args.options.teamId || args.options.teamName) {
            logger.log((this.items as unknown as TeamsAppInstallation[]).map(i => {
              return {
                id: i.id,
                displayName: i.teamsApp.displayName,
                distributionMethod: i.teamsApp.distributionMethod
              };
            }));
          }
          else {
            logger.log(this.items.map(i => {
              return {
                id: i.id,
                displayName: i.displayName,
                distributionMethod: i.distributionMethod
              };
            }));
          }
        }

        if (this.verbose) {
          logger.log(chalk.green('DONE'));
        }

        cb();
      }, (err: any) => this.handleRejectedODataJsonPromise(err, logger, cb));
  }

  public options(): CommandOption[] {
    const options: CommandOption[] = [
      {
        option: '-a, --all',
        description: 'Specify, to get apps from your organization only'
      },
      {
        option: '-i, --teamId [teamId]',
        description: 'The ID of the team for which to list installed apps. Specify either teamId or teamName but not both'
      },
      {
        option: '-t --teamName [teamName]',
        description: 'The display name of the team for which to list installed apps. Specify either teamId or teamName but not both'
      }
    ];

    const parentOptions: CommandOption[] = super.options();
    return options.concat(parentOptions);
  }

  public validate(args: CommandArgs): boolean | string {
    if (args.options.teamId && args.options.teamName) {
      return 'Specify either teamId or teamName, but not both.';
    }

    if (args.options.teamId && !Utils.isValidGuid(args.options.teamId)) {
      return `${args.options.teamId} is not a valid GUID`;
    }

    return true;
  }
}

module.exports = new TeamsAppListCommand();