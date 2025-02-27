import * as assert from 'assert';
import * as sinon from 'sinon';
import appInsights from '../../../../appInsights';
import auth from '../../../../Auth';
import { Logger } from '../../../../cli';
import Command, { CommandError } from '../../../../Command';
import request from '../../../../request';
import Utils from '../../../../Utils';
import commands from '../../commands';
const command: Command = require('./user-get');

describe(commands.USER_GET, () => {
  let log: string[];
  let logger: Logger;
  let loggerLogSpy: sinon.SinonSpy;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(appInsights, 'trackEvent').callsFake(() => { });
    auth.service.connected = true;
  });

  beforeEach(() => {
    log = [];
    logger = {
      log: (msg: string) => {
        log.push(msg);
      },
      logRaw: (msg: string) => {
        log.push(msg);
      },
      logToStderr: (msg: string) => {
        log.push(msg);
      }
    };
    loggerLogSpy = sinon.spy(logger, 'log');
    (command as any).items = [];
  });

  afterEach(() => {
    Utils.restore([
      request.get
    ]);
  });

  after(() => {
    Utils.restore([
      auth.restoreAuth,
      appInsights.trackEvent
    ]);
    auth.service.connected = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.USER_GET), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('retrieves user using id', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter=id eq ') > -1) {
        return Promise.resolve({ value: [{ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }] });
      }

      return Promise.reject('Invalid request');
    });

    command.action(logger, { options: { debug: false, id: '68be84bf-a585-4776-80b3-30aa5207aa21' } }, () => {
      try {
        assert(loggerLogSpy.calledWith({ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('retrieves user using id (debug)', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter=id eq ') > -1) {
        return Promise.resolve({ value: [{ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }] });
      }

      return Promise.reject('Invalid request');
    });

    command.action(logger, { options: { debug: true, id: '68be84bf-a585-4776-80b3-30aa5207aa21' } }, () => {
      try {
        assert(loggerLogSpy.calledWith({ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('retrieves user using user name', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter=userPrincipalName eq ') > -1) {
        return Promise.resolve({ value: [{ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }] });
      }

      return Promise.reject('Invalid request');
    });

    command.action(logger, { options: { debug: false, userName: 'AarifS@contoso.onmicrosoft.com' } }, () => {
      try {
        assert(loggerLogSpy.calledWith({ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('retrieves user using email', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter=mail eq ') > -1) {
        return Promise.resolve({ value: [{ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }] });
      }

      return Promise.reject('Invalid request');
    });

    command.action(logger, { options: { debug: false, email: 'AarifS@contoso.onmicrosoft.com' } }, () => {
      try {
        assert(loggerLogSpy.calledWith({ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "businessPhones": ["+1 425 555 0100"], "displayName": "Aarif Sherzai", "givenName": "Aarif", "jobTitle": "Administrative", "mail": null, "mobilePhone": "+1 425 555 0100", "officeLocation": null, "preferredLanguage": null, "surname": "Sherzai", "userPrincipalName": "AarifS@contoso.onmicrosoft.com" }));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('retrieves only the specified properties', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users?$filter=userPrincipalName eq 'AarifS%40contoso.onmicrosoft.com'&$select=id,mail`) {
        return Promise.resolve({ value: [{ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "mail": null }] });
      }

      return Promise.reject('Invalid request');
    });

    command.action(logger, { options: { debug: false, userName: 'AarifS@contoso.onmicrosoft.com', properties: 'id,mail' } }, () => {
      try {
        assert(loggerLogSpy.calledWith({ "id": "68be84bf-a585-4776-80b3-30aa5207aa21", "mail": null }));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('correctly handles user not found', (done) => {
    sinon.stub(request, 'get').callsFake(() => {
      return Promise.reject({
        "error": {
          "code": "Request_ResourceNotFound",
          "message": "Resource '68be84bf-a585-4776-80b3-30aa5207aa22' does not exist or one of its queried reference-property objects are not present.",
          "innerError": {
            "request-id": "9b0df954-93b5-4de9-8b99-43c204a8aaf8",
            "date": "2018-04-24T18:56:48"
          }
        }
      });
    });

    command.action(logger, { options: { debug: false, id: '68be84bf-a585-4776-80b3-30aa5207aa22' } } as any, (err?: any) => {
      try {
        assert.strictEqual(JSON.stringify(err), JSON.stringify(new CommandError(`Resource '68be84bf-a585-4776-80b3-30aa5207aa22' does not exist or one of its queried reference-property objects are not present.`)));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('fails to get user when user with provided email does not exists', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter=id eq ') > -1) {
        return Promise.resolve({ value: [] });
      }

      return Promise.reject('The specified user with id 68be84bf-a585-4776-80b3-30aa5207aa22 does not exist');
    });

    command.action(logger, { options: { debug: false, id: '68be84bf-a585-4776-80b3-30aa5207aa22' } }, (err?: any) => {
      try {
        assert.strictEqual(JSON.stringify(err), JSON.stringify(new CommandError(`The specified user with id 68be84bf-a585-4776-80b3-30aa5207aa22 does not exist`)));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('fails to get user when user with provided user name does not exists', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter=userPrincipalName eq ') > -1) {
        return Promise.resolve({ value: [] });
      }

      return Promise.reject('The specified user with user name AarifS@contoso.onmicrosoft.com does not exist');
    });

    command.action(logger, { options: { debug: false, userName: 'AarifS@contoso.onmicrosoft.com' } }, (err?: any) => {
      try {
        assert.strictEqual(JSON.stringify(err), JSON.stringify(new CommandError(`The specified user with user name AarifS@contoso.onmicrosoft.com does not exist`)));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('fails to get user when user with provided email does not exists', (done) => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter=mail eq ') > -1) {
        return Promise.resolve({ value: [] });
      }

      return Promise.reject('The specified user with email AarifS@contoso.onmicrosoft.com does not exist');
    });

    command.action(logger, { options: { debug: false, email: 'AarifS@contoso.onmicrosoft.com' } }, (err?: any) => {
      try {
        assert.strictEqual(JSON.stringify(err), JSON.stringify(new CommandError(`The specified user with email AarifS@contoso.onmicrosoft.com does not exist`)));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('handles error when multiple users with the specified email found', (done) => {
    sinon.stub(request, 'get').callsFake(opts => {
      if ((opts.url as string).indexOf('https://graph.microsoft.com/v1.0/users?$filter') > -1) {
        return Promise.resolve({
          value: [
            { id: '9b1b1e42-794b-4c71-93ac-5ed92488b67f', userPrincipalName: 'AarifS@contoso.onmicrosoft.com' },
            { id: '68be84bf-a585-4776-80b3-30aa5207aa21', userPrincipalName: 'DebraB@contoso.onmicrosoft.com' }
          ]
        });
      }

      return Promise.reject(`Multiple users with email AarifS@contoso.onmicrosoft.com found. Please disambiguate (user names): AarifS@contoso.onmicrosoft.com, DebraB@contoso.onmicrosoft.com or (ids): 9b1b1e42-794b-4c71-93ac-5ed92488b67f, 68be84bf-a585-4776-80b3-30aa5207aa21`);
    });

    command.action(logger, {
      options: {
        debug: false,
        email: 'AarifS@contoso.onmicrosoft.com'
      }
    }, (err?: any) => {
      try {
        assert.strictEqual(err.message, `Multiple users with email AarifS@contoso.onmicrosoft.com found. Please disambiguate (user names): AarifS@contoso.onmicrosoft.com, DebraB@contoso.onmicrosoft.com or (ids): 9b1b1e42-794b-4c71-93ac-5ed92488b67f, 68be84bf-a585-4776-80b3-30aa5207aa21`);
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('fails validation if id or email or userName options are not passed', () => {
    const actual = command.validate({ options: {} });
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if id, email, and userName options are passed (multiple options)', () => {
    const actual = command.validate({ options: { id: "1caf7dcd-7e83-4c3a-94f7-932a1299c844", email: "john.doe@contoso.onmicrosoft.com", userName: "i:0#.f|membership|john.doe@contoso.onmicrosoft.com" } });
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if both id and email options are passed (multiple options)', () => {
    const actual = command.validate({ options: { id: "1caf7dcd-7e83-4c3a-94f7-932a1299c844", email: "john.doe@contoso.onmicrosoft.com" } });
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if both id and userName options are passed (multiple options)', () => {
    const actual = command.validate({ options: { id: "1caf7dcd-7e83-4c3a-94f7-932a1299c844", userName: "john.doe@contoso.onmicrosoft.com" } });
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if both email and userName options are passed (multiple options)', () => {
    const actual = command.validate({ options: { email: "jonh.deo@contoso.com", userName: "john.doe@contoso.onmicrosoft.com" } });
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the id is not a valid GUID', () => {
    const actual = command.validate({ options: { id: 'invalid' } });
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the id is a valid GUID', () => {
    const actual = command.validate({ options: { id: '68be84bf-a585-4776-80b3-30aa5207aa22' } });
    assert.strictEqual(actual, true);
  });

  it('passes validation if the userName is specified', () => {
    const actual = command.validate({ options: { userName: 'john.doe@contoso.onmicrosoft.com' } });
    assert.strictEqual(actual, true);
  });

  it('passes validation if the email is specified', () => {
    const actual = command.validate({ options: { email: 'john.doe@contoso.onmicrosoft.com' } });
    assert.strictEqual(actual, true);
  });

  it('supports debug mode', () => {
    const options = command.options();
    let containsOption = false;
    options.forEach(o => {
      if (o.option === '--debug') {
        containsOption = true;
      }
    });
    assert(containsOption);
  });
});