unit Models.Project;

interface

uses
  System.SysUtils;

type
  TProjectStatus = (psPlanning, psActive, psOnHold, psCompleted);

  TProject = class
  private
    FId: Integer;
    FName: string;
    FDescription: string;
    FStatus: TProjectStatus;
    FOwnerId: Integer;
    FCreatedAt: TDateTime;
    FUpdatedAt: TDateTime;
    FDeadline: TDateTime;
  public
    constructor Create;
    destructor Destroy; override;
    
    function GetId: Integer;
    procedure SetId(const AId: Integer);
    
    function GetName: string;
    procedure SetName(const AName: string);
    
    function GetDescription: string;
    procedure SetDescription(const ADescription: string);
    
    function GetStatus: TProjectStatus;
    procedure SetStatus(const AStatus: TProjectStatus);
    
    function GetOwnerId: Integer;
    procedure SetOwnerId(const AOwnerId: Integer);
    
    function GetDeadline: TDateTime;
    procedure SetDeadline(const ADeadline: TDateTime);
    
    function IsActive: Boolean;
    procedure StartProject;
    procedure CompleteProject;
  end;

implementation

constructor TProject.Create;
begin
  inherited;
  FStatus := psPlanning;
  FCreatedAt := Now;
  FUpdatedAt := Now;
end;

destructor TProject.Destroy;
begin
  inherited;
end;

function TProject.GetId: Integer;
begin
  Result := FId;
end;

procedure TProject.SetId(const AId: Integer);
begin
  FId := AId;
end;

function TProject.GetName: string;
begin
  Result := FName;
end;

procedure TProject.SetName(const AName: string);
begin
  FName := AName;
  FUpdatedAt := Now;
end;

function TProject.GetDescription: string;
begin
  Result := FDescription;
end;

procedure TProject.SetDescription(const ADescription: string);
begin
  FDescription := ADescription;
  FUpdatedAt := Now;
end;

function TProject.GetStatus: TProjectStatus;
begin
  Result := FStatus;
end;

procedure TProject.SetStatus(const AStatus: TProjectStatus);
begin
  FStatus := AStatus;
  FUpdatedAt := Now;
end;

function TProject.GetOwnerId: Integer;
begin
  Result := FOwnerId;
end;

procedure TProject.SetOwnerId(const AOwnerId: Integer);
begin
  FOwnerId := AOwnerId;
end;

function TProject.GetDeadline: TDateTime;
begin
  Result := FDeadline;
end;

procedure TProject.SetDeadline(const ADeadline: TDateTime);
begin
  FDeadline := ADeadline;
  FUpdatedAt := Now;
end;

function TProject.IsActive: Boolean;
begin
  Result := FStatus = psActive;
end;

procedure TProject.StartProject;
begin
  SetStatus(psActive);
end;

procedure TProject.CompleteProject;
begin
  SetStatus(psCompleted);
end;

end.
