unit Controllers.UserController;

interface

uses
  System.SysUtils,
  Models.User,
  Services.UserService,
  Utils.Logger;

type
  TUserController = class
  private
    FService: TUserService;
    FLogger: TLogger;
  public
    constructor Create;
    destructor Destroy; override;
    
    function GetUserByUsername(const AUsername: string): TUser;
    function GetAllUsers: TArray<TUser>;
    function CreateUser(const AUsername, AEmail, APassword: string): Boolean;
    function DeactivateUser(AUserId: Integer): Boolean;
  end;

implementation

constructor TUserController.Create;
begin
  inherited;
  FService := TUserService.Create;
  FLogger := TLogger.Create;
end;

destructor TUserController.Destroy;
begin
  FService.Free;
  FLogger.Free;
  inherited;
end;

function TUserController.GetUserByUsername(const AUsername: string): TUser;
begin
  Result := FService.GetUserByUsername(AUsername);
end;

function TUserController.GetAllUsers: TArray<TUser>;
begin
  Result := FService.GetAllUsers;
end;

function TUserController.CreateUser(const AUsername, AEmail, APassword: string): Boolean;
begin
  try
    FService.CreateUser(AUsername, AEmail, APassword);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Create user failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

function TUserController.DeactivateUser(AUserId: Integer): Boolean;
begin
  try
    FService.DeactivateUser(AUserId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Deactivate user failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

end.
