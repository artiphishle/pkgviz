unit Models.Task;

interface

uses
  System.SysUtils,
  System.Classes;

type
  TTaskStatus = (tsNew, tsInProgress, tsCompleted, tsCancelled);
  TTaskPriority = (tpLow, tpMedium, tpHigh, tpUrgent);

  TTask = class
  private
    FId: Integer;
    FTitle: string;
    FDescription: string;
    FStatus: TTaskStatus;
    FPriority: TTaskPriority;
    FAssignedUserId: Integer;
    FProjectId: Integer;
    FCreatedAt: TDateTime;
    FUpdatedAt: TDateTime;
    FDueDate: TDateTime;
  public
    constructor Create;
    destructor Destroy; override;
    
    function GetId: Integer;
    procedure SetId(const AId: Integer);
    
    function GetTitle: string;
    procedure SetTitle(const ATitle: string);
    
    function GetDescription: string;
    procedure SetDescription(const ADescription: string);
    
    function GetStatus: string;
    procedure SetStatus(const AStatus: TTaskStatus);
    
    function GetPriority: TTaskPriority;
    procedure SetPriority(const APriority: TTaskPriority);
    
    function GetAssignedUserId: Integer;
    procedure SetAssignedUserId(const AUserId: Integer);
    
    function GetProjectId: Integer;
    procedure SetProjectId(const AProjectId: Integer);
    
    function GetCreatedAt: TDateTime;
    function GetUpdatedAt: TDateTime;
    function GetDueDate: TDateTime;
    procedure SetDueDate(const ADueDate: TDateTime);
    
    function IsOverdue: Boolean;
    function IsPastDue: Boolean;
    procedure MarkAsCompleted;
    procedure AssignTo(const AUserId: Integer);
  end;

implementation

uses
  Utils.DateUtils;

constructor TTask.Create;
begin
  inherited;
  FStatus := tsNew;
  FPriority := tpMedium;
  FCreatedAt := Now;
  FUpdatedAt := Now;
end;

destructor TTask.Destroy;
begin
  inherited;
end;

function TTask.GetId: Integer;
begin
  Result := FId;
end;

procedure TTask.SetId(const AId: Integer);
begin
  FId := AId;
end;

function TTask.GetTitle: string;
begin
  Result := FTitle;
end;

procedure TTask.SetTitle(const ATitle: string);
begin
  FTitle := ATitle;
  FUpdatedAt := Now;
end;

function TTask.GetDescription: string;
begin
  Result := FDescription;
end;

procedure TTask.SetDescription(const ADescription: string);
begin
  FDescription := ADescription;
  FUpdatedAt := Now;
end;

function TTask.GetStatus: string;
begin
  case FStatus of
    tsNew: Result := 'New';
    tsInProgress: Result := 'In Progress';
    tsCompleted: Result := 'Completed';
    tsCancelled: Result := 'Cancelled';
  else
    Result := 'Unknown';
  end;
end;

procedure TTask.SetStatus(const AStatus: TTaskStatus);
begin
  FStatus := AStatus;
  FUpdatedAt := Now;
end;

function TTask.GetPriority: TTaskPriority;
begin
  Result := FPriority;
end;

procedure TTask.SetPriority(const APriority: TTaskPriority);
begin
  FPriority := APriority;
  FUpdatedAt := Now;
end;

function TTask.GetAssignedUserId: Integer;
begin
  Result := FAssignedUserId;
end;

procedure TTask.SetAssignedUserId(const AUserId: Integer);
begin
  FAssignedUserId := AUserId;
  FUpdatedAt := Now;
end;

function TTask.GetProjectId: Integer;
begin
  Result := FProjectId;
end;

procedure TTask.SetProjectId(const AProjectId: Integer);
begin
  FProjectId := AProjectId;
end;

function TTask.GetCreatedAt: TDateTime;
begin
  Result := FCreatedAt;
end;

function TTask.GetUpdatedAt: TDateTime;
begin
  Result := FUpdatedAt;
end;

function TTask.GetDueDate: TDateTime;
begin
  Result := FDueDate;
end;

procedure TTask.SetDueDate(const ADueDate: TDateTime);
begin
  FDueDate := ADueDate;
  FUpdatedAt := Now;
end;

function TTask.IsOverdue: Boolean;
var
  DateUtil: TDateUtils;
begin
  DateUtil := TDateUtils.Create;
  try
    Result := DateUtil.IsOverdue(FDueDate);
  finally
    DateUtil.Free;
  end;
end;

function TTask.IsPastDue: Boolean;
begin
  Result := (FDueDate > 0) and (Now > FDueDate) and (FStatus <> tsCompleted);
end;

procedure TTask.MarkAsCompleted;
begin
  FStatus := tsCompleted;
  FUpdatedAt := Now;
end;

procedure TTask.AssignTo(const AUserId: Integer);
begin
  SetAssignedUserId(AUserId);
  SetStatus(tsInProgress);
end;

end.
