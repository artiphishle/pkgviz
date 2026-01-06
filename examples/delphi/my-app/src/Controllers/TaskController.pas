unit Controllers.TaskController;

interface

uses
  System.SysUtils,
  Models.Task,
  Services.TaskService,
  Utils.Logger;

type
  TTaskController = class
  private
    FService: TTaskService;
    FLogger: TLogger;
  public
    constructor Create;
    destructor Destroy; override;
    
    function CreateTask(const ATitle: string; AUserId: Integer): Boolean;
    function GetUserTasks(AUserId: Integer): TArray<TTask>;
    function GetProjectTasks(AProjectId: Integer): TArray<TTask>;
    function AssignTask(ATaskId, AUserId: Integer): Boolean;
    function CompleteTask(ATaskId: Integer): Boolean;
    function DeleteTask(ATaskId: Integer): Boolean;
  end;

implementation

constructor TTaskController.Create;
begin
  inherited;
  FService := TTaskService.Create;
  FLogger := TLogger.Create;
end;

destructor TTaskController.Destroy;
begin
  FService.Free;
  FLogger.Free;
  inherited;
end;

function TTaskController.CreateTask(const ATitle: string; AUserId: Integer): Boolean;
begin
  try
    FService.CreateTask(ATitle, '', AUserId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Create task failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

function TTaskController.GetUserTasks(AUserId: Integer): TArray<TTask>;
begin
  Result := FService.GetTasksByUser(AUserId);
end;

function TTaskController.GetProjectTasks(AProjectId: Integer): TArray<TTask>;
begin
  Result := FService.GetTasksByProject(AProjectId);
end;

function TTaskController.AssignTask(ATaskId, AUserId: Integer): Boolean;
begin
  try
    FService.AssignTask(ATaskId, AUserId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Assign task failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

function TTaskController.CompleteTask(ATaskId: Integer): Boolean;
begin
  try
    FService.CompleteTask(ATaskId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Complete task failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

function TTaskController.DeleteTask(ATaskId: Integer): Boolean;
begin
  try
    FService.DeleteTask(ATaskId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Delete task failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

end.
