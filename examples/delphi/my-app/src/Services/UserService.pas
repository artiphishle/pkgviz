unit Services.UserService;

interface

uses
  System.SysUtils,
  Models.User,
  Database.UserRepository,
  Utils.Logger,
  Utils.Validator,
  Utils.StringUtils;

type
  TUserService = class
  private
    FRepository: TUserRepository;
    FLogger: TLogger;
    FValidator: TValidator;
    FStringUtils: TStringUtils;
  public
    constructor Create;
    destructor Destroy; override;
    
    function CreateUser(const AUsername, AEmail, APassword: string): TUser;
    function GetUserById(AUserId: Integer): TUser;
    function GetUserByUsername(const AUsername: string): TUser;
    function GetUserByEmail(const AEmail: string): TUser;
    function GetAllUsers: TArray<TUser>;
    procedure UpdateUser(AUser: TUser);
    procedure DeleteUser(AUserId: Integer);
    procedure DeactivateUser(AUserId: Integer);
    procedure ActivateUser(AUserId: Integer);
    function ValidateCredentials(const AUsername, APassword: string): Boolean;
  end;

implementation

constructor TUserService.Create;
begin
  inherited;
  FRepository := TUserRepository.Create;
  FLogger := TLogger.Create;
  FValidator := TValidator.Create;
  FStringUtils := TStringUtils.Create;
end;

destructor TUserService.Destroy;
begin
  FRepository.Free;
  FLogger.Free;
  FValidator.Free;
  FStringUtils.Free;
  inherited;
end;

function TUserService.CreateUser(const AUsername, AEmail, APassword: string): TUser;
var
  PasswordHash: string;
begin
  FLogger.Log('Creating user: ' + AUsername);
  
  if not FValidator.ValidateEmail(AEmail) then
    raise Exception.Create('Invalid email format');
    
  if not FValidator.ValidateString(AUsername, 3, 50) then
    raise Exception.Create('Invalid username');
    
  PasswordHash := FStringUtils.HashPassword(APassword);
  
  Result := TUser.Create;
  Result.SetUsername(AUsername);
  Result.SetEmail(AEmail);
  Result.SetPasswordHash(PasswordHash);
  
  FRepository.Save(Result);
  FLogger.Log('User created with ID: ' + IntToStr(Result.GetId));
end;

function TUserService.GetUserById(AUserId: Integer): TUser;
begin
  Result := FRepository.FindById(AUserId);
end;

function TUserService.GetUserByUsername(const AUsername: string): TUser;
begin
  Result := FRepository.FindByUsername(AUsername);
end;

function TUserService.GetUserByEmail(const AEmail: string): TUser;
begin
  Result := FRepository.FindByEmail(AEmail);
end;

function TUserService.GetAllUsers: TArray<TUser>;
begin
  Result := FRepository.FindAll;
end;

procedure TUserService.UpdateUser(AUser: TUser);
begin
  FLogger.Log('Updating user: ' + IntToStr(AUser.GetId));
  FRepository.Update(AUser);
end;

procedure TUserService.DeleteUser(AUserId: Integer);
begin
  FLogger.Log('Deleting user: ' + IntToStr(AUserId));
  FRepository.Delete(AUserId);
end;

procedure TUserService.DeactivateUser(AUserId: Integer);
var
  User: TUser;
begin
  User := GetUserById(AUserId);
  if Assigned(User) then
  begin
    User.SetIsActive(False);
    UpdateUser(User);
    FLogger.Log('User deactivated: ' + IntToStr(AUserId));
  end;
end;

procedure TUserService.ActivateUser(AUserId: Integer);
var
  User: TUser;
begin
  User := GetUserById(AUserId);
  if Assigned(User) then
  begin
    User.SetIsActive(True);
    UpdateUser(User);
    FLogger.Log('User activated: ' + IntToStr(AUserId));
  end;
end;

function TUserService.ValidateCredentials(const AUsername, APassword: string): Boolean;
var
  User: TUser;
  PasswordHash: string;
begin
  User := GetUserByUsername(AUsername);
  Result := False;
  
  if Assigned(User) and User.GetIsActive then
  begin
    PasswordHash := FStringUtils.HashPassword(APassword);
    Result := User.GetPasswordHash = PasswordHash;
  end;
end;

end.
