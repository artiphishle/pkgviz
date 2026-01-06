unit Database.UserRepository;

interface

uses
  System.SysUtils,
  Models.User,
  Database.Connection,
  Utils.Logger;

type
  TUserRepository = class
  private
    FConnection: TDatabaseConnection;
    FLogger: TLogger;
  public
    constructor Create;
    destructor Destroy; override;
    
    procedure Save(AUser: TUser);
    procedure Update(AUser: TUser);
    procedure Delete(AUserId: Integer);
    function FindById(AUserId: Integer): TUser;
    function FindByUsername(const AUsername: string): TUser;
    function FindByEmail(const AEmail: string): TUser;
    function FindAll: TArray<TUser>;
  end;

implementation

constructor TUserRepository.Create;
begin
  inherited;
  FConnection := TDatabaseConnection.GetInstance;
  FLogger := TLogger.Create;
end;

destructor TUserRepository.Destroy;
begin
  FLogger.Free;
  inherited;
end;

procedure TUserRepository.Save(AUser: TUser);
begin
  FLogger.Log('Saving user: ' + AUser.GetUsername);
  FConnection.ExecuteQuery('INSERT INTO users...');
end;

procedure TUserRepository.Update(AUser: TUser);
begin
  FLogger.Log('Updating user: ' + IntToStr(AUser.GetId));
  FConnection.ExecuteQuery('UPDATE users...');
end;

procedure TUserRepository.Delete(AUserId: Integer);
begin
  FLogger.Log('Deleting user: ' + IntToStr(AUserId));
  FConnection.ExecuteQuery('DELETE FROM users...');
end;

function TUserRepository.FindById(AUserId: Integer): TUser;
begin
  FLogger.Log('Finding user by ID: ' + IntToStr(AUserId));
  Result := TUser.Create;
end;

function TUserRepository.FindByUsername(const AUsername: string): TUser;
begin
  FLogger.Log('Finding user by username: ' + AUsername);
  Result := TUser.Create;
end;

function TUserRepository.FindByEmail(const AEmail: string): TUser;
begin
  FLogger.Log('Finding user by email: ' + AEmail);
  Result := TUser.Create;
end;

function TUserRepository.FindAll: TArray<TUser>;
begin
  FLogger.Log('Finding all users');
  SetLength(Result, 0);
end;

end.
