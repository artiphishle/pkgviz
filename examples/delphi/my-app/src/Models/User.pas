unit Models.User;

interface

uses
  System.SysUtils;

type
  TUserRole = (urUser, urAdmin, urManager);

  TUser = class
  private
    FId: Integer;
    FUsername: string;
    FEmail: string;
    FPasswordHash: string;
    FRole: TUserRole;
    FCreatedAt: TDateTime;
    FLastLogin: TDateTime;
    FIsActive: Boolean;
  public
    constructor Create;
    destructor Destroy; override;
    
    function GetId: Integer;
    procedure SetId(const AId: Integer);
    
    function GetUsername: string;
    procedure SetUsername(const AUsername: string);
    
    function GetEmail: string;
    procedure SetEmail(const AEmail: string);
    
    function GetPasswordHash: string;
    procedure SetPasswordHash(const AHash: string);
    
    function GetRole: TUserRole;
    procedure SetRole(const ARole: TUserRole);
    
    function GetIsActive: Boolean;
    procedure SetIsActive(const AActive: Boolean);
    
    procedure UpdateLastLogin;
    function IsAdmin: Boolean;
    function CanManageProjects: Boolean;
  end;

implementation

constructor TUser.Create;
begin
  inherited;
  FRole := urUser;
  FIsActive := True;
  FCreatedAt := Now;
end;

destructor TUser.Destroy;
begin
  inherited;
end;

function TUser.GetId: Integer;
begin
  Result := FId;
end;

procedure TUser.SetId(const AId: Integer);
begin
  FId := AId;
end;

function TUser.GetUsername: string;
begin
  Result := FUsername;
end;

procedure TUser.SetUsername(const AUsername: string);
begin
  FUsername := AUsername;
end;

function TUser.GetEmail: string;
begin
  Result := FEmail;
end;

procedure TUser.SetEmail(const AEmail: string);
begin
  FEmail := AEmail;
end;

function TUser.GetPasswordHash: string;
begin
  Result := FPasswordHash;
end;

procedure TUser.SetPasswordHash(const AHash: string);
begin
  FPasswordHash := AHash;
end;

function TUser.GetRole: TUserRole;
begin
  Result := FRole;
end;

procedure TUser.SetRole(const ARole: TUserRole);
begin
  FRole := ARole;
end;

function TUser.GetIsActive: Boolean;
begin
  Result := FIsActive;
end;

procedure TUser.SetIsActive(const AActive: Boolean);
begin
  FIsActive := AActive;
end;

procedure TUser.UpdateLastLogin;
begin
  FLastLogin := Now;
end;

function TUser.IsAdmin: Boolean;
begin
  Result := FRole = urAdmin;
end;

function TUser.CanManageProjects: Boolean;
begin
  Result := (FRole = urAdmin) or (FRole = urManager);
end;

end.
