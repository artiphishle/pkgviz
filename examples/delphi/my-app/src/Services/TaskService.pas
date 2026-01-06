unit Services.TaskService;

interface

uses
  System.SysUtils,
  System.Generics.Collections,
  Models.Task,
  Database.TaskRepository,
  Utils.Logger,
  Utils.Validator;

type
  TTaskService = class
  private
    FRepository: TTaskRepository;
    FLogger: TLogger;
    FValidator: TValidator;
  public
    constructor Create;
    destructor Destroy; override;
    
    function CreateTask(const ATitle, ADescription: string; AUserId: Integer): TTask;
    function GetTaskById(ATaskId: Integer): TTask;
    function GetTasksByUser(AUserId: Integer): TArray<TTask>;
    function GetTasksByProject(AProjectId: Integer): TArray<TTask>;
    procedure UpdateTask(ATask: TTask);
    procedure DeleteTask(ATaskId: Integer);
    procedure AssignTask(ATaskId, AUserId: Integer);
    procedure CompleteTask(ATaskId: Integer);
    function GetOverdueTasks: TArray<TTask>;
  end;

implementation

constructor TTaskService.Create;
begin
  inherited;
  FRepository := TTaskRepository.Create;
  FLogger := TLogger.Create;
  FValidator := TValidator.Create;
end;

destructor TTaskService.Destroy;
begin
  FRepository.Free;
  FLogger.Free;
  FValidator.Free;
  inherited;
end;

function TTaskService.CreateTask(const ATitle, ADescription: string; AUserId: Integer): TTask;
begin
  FLogger.Log('Creating task: ' + ATitle);
  
  if not FValidator.ValidateString(ATitle, 3, 200) then
    raise Exception.Create('Invalid task title');
    
  Result := TTask.Create;
  Result.SetTitle(ATitle);
  Result.SetDescription(ADescription);
  Result.SetAssignedUserId(AUserId);
  
  FRepository.Save(Result);
  FLogger.Log('Task created with ID: ' + IntToStr(Result.GetId));
end;

function TTaskService.GetTaskById(ATaskId: Integer): TTask;
begin
  FLogger.Log('Fetching task: ' + IntToStr(ATaskId));
  Result := FRepository.FindById(ATaskId);
end;

function TTaskService.GetTasksByUser(AUserId: Integer): TArray<TTask>;
begin
  FLogger.Log('Fetching tasks for user: ' + IntToStr(AUserId));
  Result := FRepository.FindByUserId(AUserId);
end;

function TTaskService.GetTasksByProject(AProjectId: Integer): TArray<TTask>;
begin
  FLogger.Log('Fetching tasks for project: ' + IntToStr(AProjectId));
  Result := FRepository.FindByProjectId(AProjectId);
end;

procedure TTaskService.UpdateTask(ATask: TTask);
begin
  FLogger.Log('Updating task: ' + IntToStr(ATask.GetId));
  FRepository.Update(ATask);
end;

procedure TTaskService.DeleteTask(ATaskId: Integer);
begin
  FLogger.Log('Deleting task: ' + IntToStr(ATaskId));
  FRepository.Delete(ATaskId);
end;

procedure TTaskService.AssignTask(ATaskId, AUserId: Integer);
var
  Task: TTask;
begin
  Task := GetTaskById(ATaskId);
  if Assigned(Task) then
  begin
    Task.AssignTo(AUserId);
    UpdateTask(Task);
    FLogger.Log('Task assigned to user: ' + IntToStr(AUserId));
  end;
end;

procedure TTaskService.CompleteTask(ATaskId: Integer);
var
  Task: TTask;
begin
  Task := GetTaskById(ATaskId);
  if Assigned(Task) then
  begin
    Task.MarkAsCompleted;
    UpdateTask(Task);
    FLogger.Log('Task completed: ' + IntToStr(ATaskId));
  end;
end;

function TTaskService.GetOverdueTasks: TArray<TTask>;
begin
  Result := FRepository.FindOverdue;
end;

end.
