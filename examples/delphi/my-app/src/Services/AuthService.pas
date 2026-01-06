unit Services.AuthService;

interface

uses
  System.SysUtils,
  Models.User,
  Services.UserService,
  Utils.Logger;

type
  TAuthService = class
  private
    FUserService: TUserService;
    FLogger: TLogger;
    FCurrentUser: TUser;
  public
    constructor Create;
    destructor Destroy; override;
    
    function Login(const AUsername, APassword: string): Boolean;
    procedure Logout;
    function IsLoggedIn: Boolean;
    function GetCurrentUser: TUser;
    function Register(const AUsername, AEmail, APassword: string): TUser;
  end;

implementation

constructor TAuthService.Create;
begin
  inherited;
  FUserService := TUserService.Create;
  FLogger := TLogger.Create;
  FCurrentUser := nil;
end;

destructor TAuthService.Destroy;
begin
  FUserService.Free;
  FLogger.Free;
  if Assigned(FCurrentUser) then
    FCurrentUser.Free;
  inherited;
end;

function TAuthService.Login(const AUsername, APassword: string): Boolean;
begin
  FLogger.Log('Login attempt for: ' + AUsername);
  
  Result := FUserService.ValidateCredentials(AUsername, APassword);
  
  if Result then
  begin
    FCurrentUser := FUserService.GetUserByUsername(AUsername);
    if Assigned(FCurrentUser) then
    begin
      FCurrentUser.UpdateLastLogin;
      FUserService.UpdateUser(FCurrentUser);
      FLogger.Log('Login successful: ' + AUsername);
    end;
  end
  else
  begin
    FLogger.LogError('Login failed: ' + AUsername);
  end;
end;

procedure TAuthService.Logout;
begin
  if Assigned(FCurrentUser) then
  begin
    FLogger.Log('Logout: ' + FCurrentUser.GetUsername);
    FreeAndNil(FCurrentUser);
  end;
end;

function TAuthService.IsLoggedIn: Boolean;
begin
  Result := Assigned(FCurrentUser);
end;

function TAuthService.GetCurrentUser: TUser;
begin
  Result := FCurrentUser;
end;

function TAuthService.Register(const AUsername, AEmail, APassword: string): TUser;
begin
  FLogger.Log('Registering user: ' + AUsername);
  Result := FUserService.CreateUser(AUsername, AEmail, APassword);
end;

end.
